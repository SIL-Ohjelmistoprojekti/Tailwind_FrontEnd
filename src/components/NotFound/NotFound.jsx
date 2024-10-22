import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl mt-4 text-gray-600">Page Not Found.</p>
        <p className="text-2xl mt-4 text-gray-600">Couldn't find the website URL.</p>

        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
