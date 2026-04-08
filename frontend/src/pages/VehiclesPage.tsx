import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicle.service';
import VehicleCard from '../components/VehicleCard';
import { FaFilter, FaSearch, FaCar } from 'react-icons/fa';

const VehiclesPage: React.FC = () => {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    seats: '',
    transmission: '',
    fuelType: '',
    search: '',
    page: 1,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehicleService.getVehicles(filters),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase";

  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black mb-2 text-white">
          Каталог <span className="gradient-text">транспорта</span>
        </h1>
        <p className="text-gray-500 mb-8 text-sm">Найдите идеальный автомобиль для вашей поездки</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mr-3">
                  <FaFilter className="text-white text-xs" />
                </div>
                <h2 className="text-lg font-bold text-white">Фильтры</h2>
              </div>

              <form onSubmit={handleSearch} className="space-y-5">
                {/* Search */}
                <div>
                  <label className={labelClass}>Поиск</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-xs" />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Марка, модель..."
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className={labelClass}>Тип транспорта</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Все типы</option>
                    <option value="CAR">Легковой автомобиль</option>
                    <option value="MOTORCYCLE">Мотоцикл</option>
                    <option value="BICYCLE">Велосипед</option>
                    <option value="SCOOTER">Скутер</option>
                    <option value="TRUCK">Грузовик</option>
                    <option value="VAN">Фургон</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className={labelClass}>Цена за день</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="От" className={inputClass} />
                    <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="До" className={inputClass} />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className={labelClass}>Локация</label>
                  <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Город" className={inputClass} />
                </div>

                {/* Seats */}
                <div>
                  <label className={labelClass}>Количество мест</label>
                  <select name="seats" value={filters.seats} onChange={handleFilterChange} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Любое</option>
                    <option value="2">2+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                    <option value="7">7+</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className={labelClass}>Коробка передач</label>
                  <select name="transmission" value={filters.transmission} onChange={handleFilterChange} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Любая</option>
                    <option value="MANUAL">Механическая</option>
                    <option value="AUTOMATIC">Автоматическая</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className={labelClass}>Тип топлива</label>
                  <select name="fuelType" value={filters.fuelType} onChange={handleFilterChange} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Любой</option>
                    <option value="PETROL">Бензин</option>
                    <option value="DIESEL">Дизель</option>
                    <option value="ELECTRIC">Электро</option>
                    <option value="HYBRID">Гибрид</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setFilters({ type: '', minPrice: '', maxPrice: '', location: '', seats: '', transmission: '', fuelType: '', search: '', page: 1 })}
                  className="w-full text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors"
                >
                  Сбросить фильтры
                </button>
              </form>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <FaCar className="text-5xl text-gray-700 mx-auto mb-4" />
                <p className="text-rose-400 text-lg font-semibold">Ошибка загрузки данных</p>
                <p className="text-gray-500 text-sm mt-2">Попробуйте обновить страницу</p>
              </div>
            ) : data?.vehicles.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <FaCar className="text-5xl text-gray-700 mx-auto mb-4" />
                <p className="text-gray-300 text-lg font-bold">Транспорт не найден</p>
                <p className="text-gray-500 mt-2 text-sm">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    Найдено: <span className="font-bold text-orange-400">{data?.pagination.total}</span> вариантов
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.vehicles.map((vehicle: any) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center space-x-2">
                    {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setFilters({ ...filters, page })}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          page === filters.page
                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20'
                            : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
