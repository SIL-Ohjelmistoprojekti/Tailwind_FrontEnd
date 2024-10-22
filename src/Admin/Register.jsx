import React, { useState } from 'react';
import { firestore } from '../(firebase)/index';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'pendingUsers'), {
        email,
        timestamp: serverTimestamp(),
      });
      alert('Rekisteröityminen onnistui! Odota adminin hyväksyntää.');
      setEmail('');
      navigate('/');
    } catch (error) {
      console.error('Virhe rekisteröitymisessä:', error);
      setError('Rekisteröityminen epäonnistui.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-4">Rekisteröidy</h2>
        <input
          type="email"
          placeholder="Sähköposti"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Lähetä rekisteröitymispyyntö
        </button>
        {error && (
          <div
            className="bg-red-500 border-2 border-red-700 px-4 py-2 rounded-lg text-red-100 font-bold text-center cursor-pointer mt-4"
            onClick={() => setError('')}
          >
            <p>{error}</p>
            <div className="absolute top-1 right-2 font-extrabold">x</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
