import React, {useEffect, useState} from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {firestore} from '../(firebase)/index';


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
                    console.log('Document was not found!');
                }
            } catch (error) {
                console.error('Error finding information', error);
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
            <h2 className="text-xl font-bold mb-2">Recent information:</h2>
            <p>{news || 'No recent information at this current time.'}</p>
            {timestamp && (
                <p className="text-sm text-gray-600 mt-2">
                    Updated on: {formatDate(timestamp)}
                </p>
            )}
        </div>
    );
};

export default CurrentNews;
