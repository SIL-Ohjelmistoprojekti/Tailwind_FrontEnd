import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc} from 'firebase/firestore';
import {auth, firestore} from '../(firebase)/index';

const Admin = () => {
    const [news, setNews] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingMessages, setPendingMessages] = useState([]);
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

    // Hae pending-viestit Firestoresta
    useEffect(() => {
        const fetchPendingMessages = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(firestore, 'pendingRegistrations'));
                const messages = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPendingMessages(messages);
            } catch (error) {
                console.error('Virhe haettaessa viestejä:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingMessages();
    }, []);

    // Poista viesti
    const handleDeleteMessage = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'pendingRegistrations', id));
            setPendingMessages(pendingMessages.filter((message) => message.id !== id));
        } catch (error) {
            console.error('Virhe viestin poistossa:', error);
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex">
            {/* Pääsisältö: Ajankohtaiset uutiset */}
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 flex-grow">
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
            </div>

            {/* Sivupalkki: Uudet rekisteröintipyynnöt */}
            <div className="w-1/3 bg-gray-50 p-4 shadow-lg rounded-lg ml-4">
                <h3 className="text-xl font-bold mb-4">Uudet rekisteröintipyynnöt</h3>
                {loading ? (
                    <p>Ladataan...</p>
                ) : (
                    <ul>
                        {pendingMessages.length === 0 ? (
                            <p>Ei uusia rekisteröintipyyntöjä.</p>
                        ) : (
                            pendingMessages.map((message) => (
                                <li key={message.id} className="flex justify-between items-center mb-4">
                                    <p>{new Date(message.timestamp.seconds * 1000).toLocaleString()}</p>
                                    <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded"
                                    >
                                        Poista
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Admin;
