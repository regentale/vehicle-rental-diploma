import React from 'react';
import { FaUser } from 'react-icons/fa';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white mb-8">
          <span className="gradient-text">Профиль</span>
        </h1>
        <div className="glass-card rounded-2xl p-8 text-center">
          <FaUser className="text-4xl text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400">Страница профиля в разработке</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
