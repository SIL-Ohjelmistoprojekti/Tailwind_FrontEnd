import React, {useEffect, useState} from 'react';
import {doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore';
import {firestore} from '../(firebase)/index';
import emailjs from 'emailjs-com';
import {useNavigate} from 'react-router-dom';

// Funktio, API-avaimiin Firestoresta
const fetchApiKeys = async () => {
    const docRef = doc(firestore, 'ApiKeys', 'api');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.error('Ei löytynyt sellaista dokumenttia!');
        return null;
    }
};

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(20);
    const [apiKeys, setApiKeys] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getApiKeys = async () => {
            const keys = await fetchApiKeys();
            setApiKeys(keys);
        };
        getApiKeys();
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const addPendingRegistrationNotification = async () => {
        await setDoc(doc(firestore, 'pendingRegistrations', `notification_${Date.now()}`), {
            notification: 'New registration request received.',
            timestamp: serverTimestamp(),
        });
    };

    useEffect(() => {
        let timer;
        if (countdown > 0 && message.includes('Registration request sent')) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            navigate('/');
        }

        return () => clearInterval(timer);
    }, [countdown, message, navigate]);

    const handleRegister = (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setMessage('Invalid email address.');
            return;
        }

        if (!apiKeys) {
            setMessage('No API keys found. Try again later.');
            return;
        }

        const templateParams = {
            firstName,
            lastName,
            email,
            phoneNumber,
            reason,
        };

        emailjs.send(apiKeys.serviceId, apiKeys.templateId, templateParams, apiKeys.userId)
            .then(() => {
                setMessage('Registration request sent! We will process your request shortly.');
                addPendingRegistrationNotification();
                setCountdown(20); // Reset countdown
            })
            .catch(() => {
                setMessage('Error in registration. Please try again.');
            });

        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setReason('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                    type="text"
                    placeholder="Firstname"
                    className="w-full p-2 mb-4 border rounded"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Lastname"
                    className="w-full p-2 mb-4 border rounded"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Phone number"
                    className="w-full p-2 mb-4 border rounded"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Why do you want to register?"
                    className="w-full p-2 mb-4 border rounded"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Send a registration request
                </button>

                {message && (
                    <div className="mt-4 text-center">
                        <p className="text-green-500 text-lg font-semibold">{message}</p>
                        {message.includes('Registration request sent') && (
                            <>
                                <p className="mt-2 text-sm text-gray-600">We will get back to you as soon as possible.
                                    Thank you for registering!</p>
                                <p className="mt-2">
                                    Redirecting in <strong>{countdown} seconds</strong>. Or return{' '}
                                    <a href="/" className="text-blue-600 underline">here</a>.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;
