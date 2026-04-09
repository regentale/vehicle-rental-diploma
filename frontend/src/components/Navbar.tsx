import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { notificationService } from '../services/notification.service';
import NotificationsDropdown from './NotificationsDropdown';
import { FaCar, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // Обновлять каждые 30 секунд
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass-navbar shadow-2xl shadow-black/30' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20">
              <FaCar className="text-white text-lg" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Rent<span className="gradient-text">Wheels</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/vehicles" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm font-medium relative group">
              Каталог
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm font-medium relative group">
                  Мои бронирования
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </Link>
                
                {user?.role === 'OWNER' && (
                  <Link to="/my-vehicles" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm font-medium relative group">
                    Мой транспорт
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                  </Link>
                )}
                
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm font-medium relative group">
                    Админ-панель
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                  </Link>
                )}

                <NotificationsDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onUpdate={loadNotifications}
                />

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors duration-300">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                      <FaUser className="text-xs text-white" />
                    </div>
                    <span className="text-sm font-medium">{user?.firstName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-3 w-52 glass rounded-2xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 shadow-2xl shadow-black/40">
                    <Link to="/profile" className="block px-4 py-3 text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-all text-sm">
                      Профиль
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-3 text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-all text-sm">
                      Личный кабинет
                    </Link>
                    <div className="border-t border-white/5 mx-3 my-1"></div>
                    <button onClick={logout} className="block w-full text-left px-4 py-3 text-rose-400 hover:bg-white/5 transition-all text-sm">
                      Выйти
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium">
                  Войти
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2.5 rounded-xl text-sm">
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-400 text-xl hover:text-orange-400 transition-colors"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-2 glass rounded-2xl mt-2 p-4 animate-fade-in">
            <Link to="/vehicles" className="block text-gray-300 hover:text-orange-400 transition py-2.5 text-sm" onClick={() => setIsMenuOpen(false)}>
              Каталог
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="block text-gray-300 hover:text-orange-400 transition py-2.5 text-sm" onClick={() => setIsMenuOpen(false)}>
                  Мои бронирования
                </Link>
                <Link to="/profile" className="block text-gray-300 hover:text-orange-400 transition py-2.5 text-sm" onClick={() => setIsMenuOpen(false)}>
                  Профиль
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left text-rose-400 py-2.5 text-sm">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-orange-400 transition py-2.5 text-sm" onClick={() => setIsMenuOpen(false)}>
                  Войти
                </Link>
                <Link to="/register" className="block btn-primary text-center py-2.5 rounded-xl text-sm" onClick={() => setIsMenuOpen(false)}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
