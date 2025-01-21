import React, { useEffect, useState } from 'react';
import Card from '../../components/Card/Card';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar/Navbar';
import { Images } from '../../utils/ImagesConfig';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const cardData = [
    {
      id: 1,
      title: 'Member',
      buttonText: 'Click to Register Member',
      image: Images.logo,
      path: '/register/member'
    },
    {
      id: 2,
      title: 'Student',
      buttonText: 'Click to Register Student',
      image: Images.logo,
      path: '/register-student'
    },
    {
      id: 3,
      title: 'Disabled Person',
      buttonText: 'Click to Register Disabled Person',
      image: Images.logo,
      path: '/register-disabled'
        
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((card) => (
          <Card 
            key={card.id}
            isLoading={isLoading}
            title={card.title}
            buttonText={card.buttonText}
            image={Images.logo}
            onClick={() => handleCardClick(card.path)}
            />
          ))}
      </div>

      <Toaster />
      <h2>HELLO WORLD</h2>
    </div>
  </div>
  );
};

export default HomePage;