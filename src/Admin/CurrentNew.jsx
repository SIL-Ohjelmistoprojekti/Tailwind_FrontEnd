import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../(firebase)/index'; 


const CurrentNews = () => {
  const [news, setNews] = useState('');
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const docRef = doc(firestore, 'currentData', 'news');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNews(data.content);
          setTimestamp(data.timestamp);
        } else {
          console.log('Dokumenttia ei löytynyt!');
        }
      } catch (error) {
        console.error('Virhe haettaessa uutisia:', error);
      }
    };

    fetchNews();
  }, []);

  // Muunna timestamp luettavaan muotoon
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Muunna Firestore Timestamp Date-objektiksi
    return date.toLocaleString('fi-FI', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Ajankohtaista:</h2>
      <p>{news || 'Ei ajankohtaista tietoa tällä hetkellä.'}</p>
      {timestamp && (
        <p className="text-sm text-gray-600 mt-2">
          Päivitetty: {formatDate(timestamp)}
        </p>
      )}
    </div>
  );
};

export default CurrentNews;
