import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = Cookies.get('cookieConsent');
        if (!consent) {
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set('cookieConsent', 'true', { expires: 365 });
        setShowConsent(false);
    };

    if (!showConsent) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-center items-center">
            <div>
                <p className="mr-4">This site uses cookies to enhance your experience.</p>
                <p className="text-sm mt-2">No personal data or tracking is saved.</p>
            </div>
            <button onClick={handleAccept} className="bg-blue-500 text-white p-2 rounded">
                OK
            </button>
        </div>
    );
};

export default CookieConsent;