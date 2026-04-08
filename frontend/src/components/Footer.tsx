import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/5" style={{ background: '#080014' }}>
      {/* Gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                <FaCar className="text-white text-sm" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Rent<span className="gradient-text">Wheels</span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Современная платформа для аренды транспорта. Быстро, удобно, надёжно.
            </p>
            <div className="flex space-x-2">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-300 text-sm">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase">Навигация</h3>
            <ul className="space-y-3">
              {[
                { to: '/vehicles', label: 'Каталог транспорта' },
                { to: '/about', label: 'О нас' },
                { to: '/contact', label: 'Контакты' },
                { to: '/faq', label: 'FAQ' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-600 hover:text-orange-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase">Поддержка</h3>
            <ul className="space-y-3">
              {[
                { to: '/help', label: 'Центр помощи' },
                { to: '/terms', label: 'Условия использования' },
                { to: '/privacy', label: 'Конфиденциальность' },
                { to: '/safety', label: 'Безопасность' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-gray-600 hover:text-orange-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase">Контакты</h3>
            <ul className="space-y-4">
              {[
                { icon: FaEnvelope, text: 'info@rentwheels.com' },
                { icon: FaPhone, text: '+7 (999) 123-45-67' },
                { icon: FaMapMarkerAlt, text: 'г. Москва, ул. Примерная, д. 1' },
                { icon: FaClock, text: 'Круглосуточно, 24/7' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="text-orange-500/40 mt-0.5 flex-shrink-0 text-xs" />
                  <span className="text-gray-600 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-700 text-xs">
            &copy; 2026 RentWheels. Все права защищены.
          </p>
          <p className="text-gray-700 text-xs flex items-center gap-1.5">
            Сделано с <FaHeart className="text-rose-500 text-[10px]" /> в России
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
