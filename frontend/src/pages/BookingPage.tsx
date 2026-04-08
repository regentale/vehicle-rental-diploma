import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
import { bookingService } from '../services/booking.service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { FaCalendar, FaMapMarkerAlt, FaCar, FaShieldAlt } from 'react-icons/fa';

const BookingPage: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 86400000));
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => vehicleService.getVehicleById(vehicleId!),
    enabled: !!vehicleId,
  });

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!vehicle) return 0;
    return calculateTotalDays() * Number(vehicle.pricePerDay);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) { toast.error('Выберите даты аренды'); return; }
    if (!pickupLocation) { toast.error('Укажите место получения'); return; }
    if (startDate >= endDate) { toast.error('Дата окончания должна быть позже даты начала'); return; }
    setIsSubmitting(true);
    try {
      const availabilityCheck = await vehicleService.checkAvailability(vehicleId!, startDate, endDate);
      if (!availabilityCheck.available) { toast.error('Транспорт недоступен на выбранные даты'); setIsSubmitting(false); return; }
      const booking = await bookingService.createBooking({ vehicleId: vehicleId!, startDate, endDate, pickupLocation, dropoffLocation: dropoffLocation || undefined, notes: notes || undefined });
      toast.success('Бронирование создано успешно!');
      navigate(`/payment/${booking.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка создания бронирования');
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0118' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0118' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Транспорт не найден</h2>
          <button onClick={() => navigate('/vehicles')} className="text-orange-400 hover:text-orange-300 transition">Вернуться к каталогу</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white mb-8">
          Бронирование <span className="gradient-text">транспорта</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Детали бронирования</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Дата начала аренды</label>
                    <div className="relative">
                      <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10 text-sm" />
                      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} dateFormat="dd.MM.yyyy" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Дата окончания аренды</label>
                    <div className="relative">
                      <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10 text-sm" />
                      <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} minDate={startDate || new Date()} dateFormat="dd.MM.yyyy" className={inputClass} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Место получения *</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm" />
                    <input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required placeholder="Адрес получения" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Место возврата (опционально)</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm" />
                    <input type="text" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} placeholder="Адрес возврата" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Дополнительные пожелания</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Укажите любые дополнительные пожелания" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all" />
                </div>

                <div className="glass rounded-xl p-4">
                  <label className="flex items-start">
                    <input type="checkbox" required className="mt-1 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/30" />
                    <span className="ml-2 text-sm text-gray-400">
                      Я согласен с <a href="/terms" className="text-orange-400 hover:text-orange-300">условиями аренды</a> и <a href="/privacy" className="text-orange-400 hover:text-orange-300">политикой конфиденциальности</a>
                    </span>
                  </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Создание бронирования...' : 'Продолжить к оплате'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">Сводка заказа</h2>

              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-shrink-0">
                  {vehicle.images[0] ? (
                    <img src={vehicle.images[0]} alt={vehicle.brand} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <FaCar className="text-gray-600 text-xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{vehicle.brand} {vehicle.model}</h3>
                  <p className="text-xs text-gray-600">{vehicle.year}</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-4 pb-4 border-b border-white/5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Цена за день:</span><span className="font-bold text-white">${vehicle.pricePerDay}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Количество дней:</span><span className="font-bold text-white">{calculateTotalDays()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Стоимость аренды:</span><span className="font-bold text-white">${calculateTotalPrice()}</span></div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-white">Итого:</span>
                <span className="text-2xl font-black gradient-text-alt">${calculateTotalPrice()}</span>
              </div>

              <div className="glass rounded-xl p-3.5 text-sm">
                <div className="flex items-start gap-2">
                  <FaShieldAlt className="text-emerald-400 mt-0.5 flex-shrink-0 text-sm" />
                  <div>
                    <p className="font-semibold text-emerald-400 text-xs">Бесплатная отмена</p>
                    <p className="text-gray-500 text-xs mt-0.5">Отмените за 24 часа до начала без штрафов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
