import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
// @ts-ignore
import { FaStar, FaMapMarkerAlt, FaCar, FaGasPump, FaCog, FaUsers, FaCalendar, FaRegHeart } from 'react-icons/fa';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = React.useState(0);

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getVehicleById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0118' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0118' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Транспорт не найден</h2>
          <button onClick={() => navigate('/vehicles')} className="text-orange-400 hover:text-orange-300 transition">
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  const images = vehicle.images.length > 0 ? vehicle.images : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="relative h-96">
                <img src={images[selectedImage]} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
                <button className="absolute top-4 right-4 glass p-3 rounded-xl hover:bg-white/10 transition">
                  <FaRegHeart className="text-gray-400 text-lg" />
                </button>
              </div>
              {images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === index ? 'border-orange-500' : 'border-white/10'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="glass-card rounded-2xl p-6 mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Описание</h2>
              <p className="text-gray-400 leading-relaxed text-sm">{vehicle.description}</p>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Характеристики</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: FaUsers, label: 'Мест', value: vehicle.seats, color: 'from-orange-500 to-amber-500' },
                    { icon: FaCog, label: 'КПП', value: vehicle.transmission, color: 'from-rose-500 to-pink-500' },
                    { icon: FaGasPump, label: 'Топливо', value: vehicle.fuelType, color: 'from-violet-500 to-purple-500' },
                    { icon: FaCalendar, label: 'Год', value: vehicle.year, color: 'from-emerald-500 to-teal-500' },
                  ].map((spec, i) => (
                    <div key={i} className="glass rounded-xl p-3 flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${spec.color} flex items-center justify-center flex-shrink-0`}>
                        <spec.icon className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{spec.label}</p>
                        <p className="font-bold text-white text-sm">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Дополнительные опции</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature: string, index: number) => (
                      <span key={index} className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="glass-card rounded-2xl p-6 mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Отзывы</h2>
              {vehicle.reviews && vehicle.reviews.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.reviews.slice(0, 5).map((review: any) => (
                    <div key={review.id} className="border-b border-white/5 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                            <span className="font-bold text-white text-sm">
                              {review.user.firstName[0]}{review.user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{review.user.firstName} {review.user.lastName}</p>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-gray-700'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      {review.comment && <p className="text-gray-400 text-sm">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Пока нет отзывов</p>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="mb-4">
                <h1 className="text-2xl font-black text-white">{vehicle.brand} {vehicle.model}</h1>
                <div className="flex items-center mt-2 text-gray-500 text-sm">
                  <FaMapMarkerAlt className="mr-1 text-orange-500/40" />
                  <span>{vehicle.location}</span>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {vehicle.averageRating > 0 ? (
                  <>
                    <FaStar className="text-amber-400 mr-1 text-sm" />
                    <span className="font-bold text-white mr-1">{vehicle.averageRating.toFixed(1)}</span>
                    <span className="text-gray-600 text-sm">({vehicle._count.reviews} отзывов)</span>
                  </>
                ) : (
                  <span className="text-gray-600 text-sm">Нет отзывов</span>
                )}
              </div>

              <div className="border-t border-b border-white/5 py-4 mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-black gradient-text-alt">{vehicle.pricePerDay} ₸</span>
                  <span className="text-gray-600 ml-2">/день</span>
                </div>
                {vehicle.pricePerHour && (
                  <p className="text-sm text-gray-600 mt-1">или {vehicle.pricePerHour} ₸/час</p>
                )}
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Владелец:</span>
                  <span className="font-semibold text-white text-sm">{vehicle.owner.firstName} {vehicle.owner.lastName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Статус:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    vehicle.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {vehicle.status === 'AVAILABLE' ? 'Доступен' : 'Недоступен'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking/${vehicle.id}`)}
                disabled={vehicle.status !== 'AVAILABLE'}
                className="w-full btn-primary py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Забронировать
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Бесплатная отмена за 24 часа до начала аренды
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
