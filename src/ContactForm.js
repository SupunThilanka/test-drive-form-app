import React, { useState } from 'react';
import './FormDetails.css'; // Import your CSS file
import ReCAPTCHA from 'react-google-recaptcha';

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", 
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
    "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", 
    "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", 
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
    "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
    "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", 
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", 
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", 
    "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
    "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
    "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        jobTitle: '',
        country: '',
        companyEmail: '',
        receiveNews: false,
    });

    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isWarning, setIsWarning] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state for the "Send" button

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Double-check if reCAPTCHA token exists
        if (!recaptchaToken) {
            setModalMessage('Please complete the reCAPTCHA to verify you are not a robot.');
            setIsWarning(true);
            setShowModal(true);
            return;
        }

        const payload = {
            email: formData.companyEmail,
            recaptchaToken, // Add the reCAPTCHA token to the payload
        };

        setIsLoading(true); // Start loading
        try {
            const response = await fetch('https://app.ursaleo.com/api/entitlement/guest/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                setModalMessage('✅ Form submitted successfully! You will be redirected to the UrsaLeo website.');
                setIsWarning(false);
                setShowModal(true);
            } else {
                const errorResult = await response.json();
                if (errorResult.message === 'User already exists.') {
                    setModalMessage(
                    '❌ This email is already registered. Please log in <a href="https://app.ursaleo.com" target="_blank" style="color: blue; text-decoration: underline;">here</a> and reset your password if needed.'
                    );
                } else {
                    setModalMessage(`❌ Error: ${errorResult.message || response.statusText}`);
                }
                setIsWarning(true);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setModalMessage('❌ Form submission failed due to a network error.');
            setIsWarning(true);
            setShowModal(true);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (!isWarning) {
            window.location.href = 'https://ursaleo.com/';
        }
    };

    return (
        <div>
            <div className="form-container">
                <p className="bebas-neue-regular">Test Drive a Twin</p>
                <p className="form-description2">
                    Please fill in the details below and click send, you will receive an email invite to test drive a digital twin. 
                    Please check your spam folder if you do not see the invite.<br />
                    Test drive is for 30 days and has some feature limitations compared to a production deployment.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name <span className="required-star">*</span></label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name <span className="required-star">*</span></label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="company">Company <span className="required-star">*</span></label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="jobTitle">Job Title <span className="required-star">*</span></label>
                            <input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country <span className="required-star">*</span></label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            >
                                <option value=""></option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyEmail">Company Email <span className="required-star">*</span></label> 
                            <input
                                type="email"
                                id="companyEmail"
                                name="companyEmail"
                                value={formData.companyEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Checkbox for receiving news and offers */}
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="receiveNews"
                                checked={formData.receiveNews}
                                onChange={handleChange}
                            />
                            I wish to receive news and offers from UrsaLeo
                        </label>
                    </div>

                    {/* Google reCAPTCHA */}
                    <div className="form-group">
                        <ReCAPTCHA
                            sitekey="6LeyQEQqAAAAANf7DtFOnaYns_xtGN8jyL-SEl6w"  // Replace with your actual reCAPTCHA site key
                            onChange={handleRecaptchaChange}
                        />
                    </div>

                    {/* Send button with loading state */}
                    <button type="submit" className="save-button" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>

                {showModal && (
                    <div className="modal-overlay">
                        <div className={`modal-content ${isWarning ? 'modal-warning' : 'modal-success'}`}>
                            <div className="modal-header">
                                <div className={`modal-icon ${isWarning ? 'icon-warning' : 'icon-success'}`}>
                                    {isWarning ? (
                                        <i className="fas fa-exclamation-circle"></i>
                                    ) : (
                                        <i className="fas fa-check-circle"></i>
                                    )}
                                </div>
                                <h2>{isWarning ? 'Warning' : 'Success'}</h2>
                            </div>
                            <div className="modal-body">
                                {/* Displaying HTML in the modal */}
                                <p dangerouslySetInnerHTML={{ __html: modalMessage }}></p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={handleCloseModal}
                                    className={`modal-button ${isWarning ? 'button-warning' : 'button-success'}`}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactForm;
