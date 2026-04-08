import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #120520 50%, #0a0118 100%)' }}>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="text-center relative z-10">
        <h1 className="text-[120px] sm:text-[180px] font-black gradient-text leading-none">404</h1>
        <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-500 mb-8 text-base">
          К сожалению, запрашиваемая страница не существует
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 btn-primary px-8 py-3.5 rounded-xl font-bold"
        >
          <FaHome />
          <span>Вернуться на главную</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
