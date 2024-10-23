import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../(firebase)/index';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/admin');
      })
      .catch((error) => {
        console.error('Virhe kirjautumisessa:', error);
        alert('Kirjautuminen epäonnistui. Tarkista tunnuksesi.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Admin Kirjautuminen</h2>
        <input
          type="email"
          placeholder="Sähköposti"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Salasana"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Kirjaudu sisään
        </button>
        <p className="mt-4 text-center">
          Not have an account? <Link to="/register" className="text-blue-600">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;