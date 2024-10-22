import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../(firebase)/index';

const Admin = () => {
  const [news, setNews] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Tarkista kirjautumistila
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Tallenna uutiset Firestoreen
  const handleSave = async () => {
    if (!news.trim()) {
      alert('Kirjoita jotain sisältöä.');
      return;
    }
    setLoading(true);
    try {
      await setDoc(doc(firestore, 'currentData', 'news'), {
        content: news,
        timestamp: serverTimestamp(),
      });
      alert('Ajankohtainen tieto tallennettu onnistuneesti!');
      setNews('');
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
      alert('Tietojen tallennus epäonnistui.');
    } finally {
      setLoading(false);
    }
  };

  // Uloskirjautuminen
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert('Olet kirjautunut ulos.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Virhe uloskirjautumisessa:', error);
      });
  };

  // Takaisin etusivulle
  const goToFrontpage = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Ajankohtainen tieto (esim. sää):
        </label>
        <textarea
          value={news}
          onChange={(e) => setNews(e.target.value)}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          rows="4"
          placeholder="Kirjoita ajankohtainen tieto..."
        />
        <button
          onClick={handleSave}
          className={`mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Tallennetaan...' : 'Tallenna'}
        </button>
        <button
          onClick={handleLogout}
          className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded-lg"
        >
          Kirjaudu ulos
        </button>
        <button
          onClick={goToFrontpage}
          className="mt-4 w-full py-2 px-4 bg-gray-600 text-white rounded-lg"
        >
          Back to the frontpage
        </button>
      </div>
    </div>
  );
};

export default Admin;
