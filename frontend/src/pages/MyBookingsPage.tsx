import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { Link } from 'react-router-dom';
import { FaCar, FaCalendar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const MyBookingsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: () => bookingService.getBookings({ status: statusFilter || undefined }),
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Ожидает' },
      CONFIRMED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Подтверждено' },
      ACTIVE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Активно' },
      COMPLETED: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', label: 'Завершено' },
      CANCELLED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: 'Отменено' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-white">
            Мои <span className="gradient-text">бронирования</span>
          </h1>
          <Link to="/vehicles" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold">
            Забронировать транспорт
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="glass-card rounded-2xl p-3 mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { value: '', label: 'Все' },
              { value: 'PENDING', label: 'Ожидает' },
              { value: 'CONFIRMED', label: 'Подтверждено' },
              { value: 'ACTIVE', label: 'Активно' },
              { value: 'COMPLETED', label: 'Завершено' },
              { value: 'CANCELLED', label: 'Отменено' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition text-sm font-semibold ${
                  statusFilter === tab.value
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        ) : data?.bookings.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <FaCar className="text-5xl text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Нет бронирований</h2>
            <p className="text-gray-500 mb-6 text-sm">Вы еще не забронировали ни одного транспорта</p>
            <Link to="/vehicles" className="inline-block btn-primary px-6 py-3 rounded-xl font-bold text-sm">
              Посмотреть каталог
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.bookings.map((booking: any) => (
              <div key={booking.id} className="glass-card rounded-2xl overflow-hidden group">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {booking.vehicle.images?.[0] ? (
                          <img src={booking.vehicle.images[0]} alt={booking.vehicle.brand} className="w-full h-full object-cover" />
                        ) : (
                          <FaCar className="text-gray-600 text-2xl" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{booking.vehicle.brand} {booking.vehicle.model}</h3>
                        <p className="text-gray-600 text-xs">{booking.vehicle.type}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <FaMapMarkerAlt className="mr-1 text-orange-500/40" />
                          <span>{booking.pickupLocation}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: FaCalendar, label: 'Дата начала', value: new Date(booking.startDate).toLocaleDateString('ru-RU') },
                      { icon: FaCalendar, label: 'Дата окончания', value: new Date(booking.endDate).toLocaleDateString('ru-RU') },
                      { icon: FaClock, label: 'Длительность', value: `${booking.totalDays} дней` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <item.icon className="text-orange-500/40 text-sm" />
                        <div>
                          <p className="text-[10px] text-gray-600 uppercase tracking-wider">{item.label}</p>
                          <p className="font-bold text-white text-sm">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-4 sm:mb-0">
                      <span className="text-xl font-black gradient-text-alt">{booking.totalPrice} ₸</span>
                      <span className="text-gray-600 ml-2 text-xs">({booking.pricePerDay} ₸/день)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/bookings/${booking.id}`} className="btn-outline px-4 py-2 rounded-xl text-xs font-bold">
                        Подробнее
                      </Link>
                      {booking.status === 'PENDING' && (
                        <button className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition">
                          Отменить
                        </button>
                      )}
                      {booking.status === 'COMPLETED' && !booking.review && (
                        <button className="btn-primary px-4 py-2 rounded-xl text-xs font-bold">
                          Оставить отзыв
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  page === data.pagination.page
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                    : 'glass text-gray-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
