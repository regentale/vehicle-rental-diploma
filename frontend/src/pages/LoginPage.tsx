import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaCar } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      toast.success('Вход выполнен успешно!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка входа');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #120520 50%, #0a0118 100%)' }}>
      {/* Decorative glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="glass-card rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <FaCar className="text-white text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">Вход в систему</h2>
            <p className="text-gray-500 mt-2 text-sm">Войдите в свой аккаунт</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                Пароль
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/30" />
                <span className="ml-2 text-sm text-gray-500">Запомнить меня</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition">
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-xl font-bold"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-gray-600 text-xs" style={{ background: 'rgba(255,255,255,0.03)' }}>Нет аккаунта?</span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition text-sm">
              Зарегистрироваться →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
