import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { FaCar, FaCalendar, FaHeart, FaBell, FaUser } from 'react-icons/fa';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const statCards = [
    { label: 'Активные бронирования', value: '0', icon: FaCalendar, gradient: 'from-orange-500 to-amber-500' },
    { label: 'Всего поездок', value: '0', icon: FaCar, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Избранное', value: '0', icon: FaHeart, gradient: 'from-rose-500 to-pink-500' },
    { label: 'Уведомления', value: '0', icon: FaBell, gradient: 'from-violet-500 to-purple-500' },
  ];

  const quickLinks = [
    { to: '/vehicles', icon: FaCar, title: 'Найти транспорт', desc: 'Просмотреть каталог', gradient: 'from-orange-500 to-amber-500' },
    { to: '/my-bookings', icon: FaCalendar, title: 'Мои бронирования', desc: 'Управление заказами', gradient: 'from-rose-500 to-pink-500' },
    { to: '/profile', icon: FaUser, title: 'Профиль', desc: 'Настройки аккаунта', gradient: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">
            Добро пожаловать, <span className="gradient-text">{user?.firstName}!</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Управляйте своими бронированиями и профилем</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium">{card.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{card.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <card.icon className="text-white text-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link, i) => (
            <Link key={i} to={link.to} className="glass-card rounded-2xl p-5 group">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <link.icon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{link.title}</h3>
                  <p className="text-gray-500 text-xs">{link.desc}</p>
                </div>
              </div>
            </Link>
          ))}

          {user?.role === 'OWNER' && (
            <Link to="/my-vehicles" className="glass-card rounded-2xl p-5 group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaCar className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Мой транспорт</h3>
                  <p className="text-gray-500 text-xs">Управление автомобилями</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-8 glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Последняя активность</h2>
          <div className="text-center py-10">
            <FaCar className="text-4xl text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">Пока нет активности</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
