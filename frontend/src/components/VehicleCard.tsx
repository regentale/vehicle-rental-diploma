import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart, FaCar, FaGasPump, FaCogs, FaUsers } from 'react-icons/fa';

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    pricePerDay: number;
    images: string[];
    location: string;
    averageRating?: number;
    reviewCount?: number;
    seats: number;
    transmission: string;
    fuelType: string;
  };
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onFavoriteToggle, isFavorite = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getPlaceholderColor = (type: string) => {
    const colors: Record<string, string> = {
      CAR: 'from-blue-600 to-blue-400',
      MOTORCYCLE: 'from-red-600 to-red-400',
      BICYCLE: 'from-green-600 to-green-400',
      SCOOTER: 'from-purple-600 to-purple-400',
      TRUCK: 'from-yellow-600 to-yellow-400',
      VAN: 'from-indigo-600 to-indigo-400',
    };
    return colors[type] || 'from-gray-600 to-gray-400';
  };

  const imageUrl = vehicle.images?.[0];
  const hasValidImage = imageUrl && !imageError;

  return (
    <div className="glass-card rounded-2xl overflow-hidden group">
      <div className="relative h-44 overflow-hidden">
        {hasValidImage ? (
          <>
            <img
              src={imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!imageLoaded && (
              <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderColor(vehicle.type)} animate-pulse`} />
            )}
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderColor(vehicle.type)} flex items-center justify-center`}>
            <FaCar className="text-5xl text-white/30 group-hover:text-white/40 transition-all duration-500" />
          </div>
        )}

        <button
          onClick={() => onFavoriteToggle?.(vehicle.id)}
          className="absolute top-3 right-3 glass p-2 rounded-xl hover:bg-white/10 transition"
        >
          {isFavorite ? (
            <FaHeart className="text-rose-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-400 text-sm" />
          )}
        </button>

        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[11px] font-bold">
          {vehicle.type}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-950/90 to-transparent"></div>
      </div>

      <div className="p-5">
        <Link to={`/vehicles/${vehicle.id}`}>
          <h3 className="text-lg font-bold text-white hover:text-orange-400 transition">
            {vehicle.brand} {vehicle.model}
          </h3>
        </Link>

        <div className="flex items-center mt-1.5 text-xs text-gray-500">
          <FaMapMarkerAlt className="mr-1 text-orange-500/40" />
          <span>{vehicle.location}</span>
        </div>

        <div className="flex items-center mt-2">
          {vehicle.averageRating ? (
            <>
              <FaStar className="text-amber-400 text-xs" />
              <span className="ml-1 text-xs font-bold text-white">{vehicle.averageRating.toFixed(1)}</span>
              <span className="ml-1 text-xs text-gray-600">({vehicle.reviewCount} отзывов)</span>
            </>
          ) : (
            <span className="text-xs text-gray-600">Нет отзывов</span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FaUsers className="text-violet-500/40" />
            {vehicle.seats} мест
          </span>
          <span className="flex items-center gap-1">
            <FaCogs className="text-rose-500/40" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1">
            <FaGasPump className="text-orange-500/40" />
            {vehicle.fuelType}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div>
            <span className="text-xl font-black text-white">{vehicle.pricePerDay} ₸</span>
            <span className="text-gray-600 text-xs ml-1">/день</span>
          </div>
          <Link
            to={`/booking/${vehicle.id}`}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
          >
            Забронировать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
