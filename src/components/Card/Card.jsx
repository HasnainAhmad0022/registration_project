import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Don't forget to import the styles

const Card = ({ isLoading, title, buttonText, onClick, image }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Skeleton height={192} /> {/* For image */}
        <div className="p-5">
          <Skeleton height={24} width={140} className="mb-3" /> {/* For title */}
          <Skeleton height={40} /> {/* For button */}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transition-transform">
      <a href="#">
        <img 
          className="rounded-t-lg w-full h-48 object-contain" 
          src={image} 
          alt="product image" 
        />
      </a>
      <div className="p-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3">
          {title}
        </h5>
        <button onClick={onClick} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
