import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-[#8f00ff]">404</h1>
      <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
      <p className="text-xl mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="bg-[#8f00ff] text-white px-6 py-3 rounded-lg hover:bg-[#6f00c4] transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound; 