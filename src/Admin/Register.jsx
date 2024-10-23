import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../(firebase)/index';
import emailjs from 'emailjs-com'; 
import { useNavigate } from 'react-router-dom'; 

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
  const [countdown, setCountdown] = useState(20); // Laskuri alkaa 20 sekunnista
  const [apiKeys, setApiKeys] = useState(null);
  const navigate = useNavigate(); // Uudelleenohjaus

  // Haetaan API-avaimet Firestoresta
  useEffect(() => {
    const getApiKeys = async () => {
      const keys = await fetchApiKeys();
      setApiKeys(keys);
    };
    getApiKeys();
  }, []);

  // Email-validointi
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Lisää rekisteröintipyyntö Firestoreen adminille
  const addPendingRegistrationNotification = async () => {
    await setDoc(doc(firestore, 'pendingRegistrations', `notification_${Date.now()}`), {
      notification: 'Uusi rekisteröintipyyntö saapunut.',
      timestamp: serverTimestamp(),
    });
  };

  // Laskurinii
  useEffect(() => {
    let timer;
    if (countdown > 0 && message.includes('Rekisteröintipyyntö lähetetty')) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000); // Vähennä sekunti joka sekunti
    } else if (countdown === 0) {
      navigate('/'); // Uudelleenohjaus, kun laskuri saavuttaa nollan
    }

    return () => clearInterval(timer); // Pysäytä intervalli komponentin purkautuessa
  }, [countdown, message, navigate]);

  // Käsittele rekisteröityminen
  const handleRegister = (e) => {
    e.preventDefault();

    // sähköposti validointi
    if (!validateEmail(email)) {
      setMessage('Virheellinen sähköpostiosoite.');
      return;
    }

    if (!apiKeys) {
      setMessage('API-avaimia ei löytynyt. Yritä myöhemmin uudelleen.');
      return;
    }

    const templateParams = {
      firstName,
      lastName,
      email,
      phoneNumber,
      reason,
    };

    // Lähetä rekisteröintipyyntö EmailJS:n kautta
    emailjs.send(apiKeys.serviceId, apiKeys.templateId, templateParams, apiKeys.userId)
      .then(() => {
        // Success reksiteröinti
        setMessage('Rekisteröintipyyntö lähetetty! Admin käsittelee pyyntösi pian.');
        addPendingRegistrationNotification(); // Lisää tieto Firestoreen
      })
      .catch(() => {
        setMessage('Virhe rekisteröitymisessä. Yritä uudelleen.');
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
        <h2 className="text-2xl font-bold mb-4">Rekisteröidy</h2>
        <input
          type="text"
          placeholder="Etunimi"
          className="w-full p-2 mb-4 border rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sukunimi"
          className="w-full p-2 mb-4 border rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Sähköposti"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Puhelinnumero"
          className="w-full p-2 mb-4 border rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <textarea
          placeholder="Miksi haluat rekisteröityä?"
          className="w-full p-2 mb-4 border rounded"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Lähetä rekisteröitymispyyntö
        </button>

        {message && (
          <div className="mt-4 text-center">
            <p className="text-green-500">{message}</p>
            {/* Laskuriii */}
            {message.includes('Rekisteröintipyyntö lähetetty') && (
              <>
                <p className="mt-2">Palaamme asiaan mahdollisimman pian. Kiitos rekisteröitymisestä!</p>
                <p className="mt-2">
                  Palaat pääsivulle <strong>{countdown} sekunnin</strong> kuluttua. Tai voit myös palata{' '}
                  <a href="/" className="text-blue-600 underline">tästä</a>.
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
