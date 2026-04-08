import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaShieldAlt, FaHeadset, FaStar, FaSearch, FaMapMarkerAlt, FaArrowRight, FaGasPump, FaCogs, FaUsers, FaCheckCircle, FaRocket, FaClock, FaCreditCard, FaRoute, FaBolt, FaHeart, FaPlay } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const popularCars = [
    { name: 'Toyota Camry 70', year: 2024, price: '25 000', rating: 4.8, reviews: 124, fuel: 'Бензин', transmission: 'Автомат', seats: 5, tag: 'Популярный', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop' },
    { name: 'BMW X5 xDrive', year: 2024, price: '55 000', rating: 4.9, reviews: 89, fuel: 'Дизель', transmission: 'Автомат', seats: 5, tag: 'Премиум', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop' },
    { name: 'Mercedes E-Class', year: 2023, price: '45 000', rating: 4.7, reviews: 156, fuel: 'Бензин', transmission: 'Автомат', seats: 5, tag: 'Хит', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop' },
  ];

  const stats = [
    { value: '2000+', label: 'Автомобилей', icon: FaCar },
    { value: '15K+', label: 'Клиентов', icon: FaUsers },
    { value: '50+', label: 'Городов', icon: FaMapMarkerAlt },
    { value: '4.9', label: 'Рейтинг', icon: FaStar },
  ];

  return (
    <div className="overflow-hidden" style={{ background: '#0a0118' }}>
      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center grid-pattern">
        {/* Decorative glows */}
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        <div className="hero-glow hero-glow-3"></div>

        {/* Decorative orbiting ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] deco-ring animate-spin-slow opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] deco-ring animate-spin-slow opacity-15" style={{ animationDirection: 'reverse', animationDuration: '35s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass mb-10 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-sm text-gray-300 font-medium">Более 2000 автомобилей доступно прямо сейчас</span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tight transition-all duration-700 delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="text-white">Аренда</span>
              <br />
              <span className="text-white">транспорта </span>
              <span className="gradient-text">проще</span>
            </h1>

            <p className={`text-lg sm:text-xl text-gray-400 mb-14 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Мгновенное бронирование, прозрачные цены, полная страховка на каждую поездку.
            </p>
            
            {/* Search Bar */}
            <div className={`max-w-3xl mx-auto glass rounded-3xl p-3 transition-all duration-700 delay-400 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative group">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-focus-within:text-orange-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Город или локация"
                    className="input pl-11 rounded-2xl"
                  />
                </div>
                
                <div className="relative group">
                  <FaCar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-focus-within:text-orange-400 transition-colors" />
                  <select className="input pl-11 appearance-none cursor-pointer rounded-2xl">
                    <option>Тип транспорта</option>
                    <option>Легковой автомобиль</option>
                    <option>Мотоцикл</option>
                    <option>Велосипед</option>
                    <option>Грузовик</option>
                  </select>
                </div>
                
                <Link
                  to="/vehicles"
                  className="btn-primary flex items-center justify-center space-x-2 rounded-2xl py-3.5"
                >
                  <FaSearch className="text-sm" />
                  <span>Найти</span>
                </Link>
              </div>
            </div>

            {/* Stats Row */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {stats.map((stat, i) => (
                <div key={i} className="glass rounded-2xl px-4 py-5 group hover:bg-white/[0.06] transition-all duration-300 cursor-default">
                  <stat.icon className="text-orange-500/50 text-sm mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-black gradient-text-alt mb-0.5">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-9 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2.5 bg-gradient-to-b from-orange-500 to-rose-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <FaBolt className="text-orange-400 text-xs" />
              <span className="text-orange-400 font-semibold text-xs tracking-widest uppercase">Преимущества</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
              Почему выбирают <span className="gradient-text">нас</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-base">
              Мы создали платформу, которая делает аренду максимально простой
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FaCar, title: 'Широкий выбор', desc: 'Более 2000 автомобилей различных классов — от эконом до премиум', gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10' },
              { icon: FaShieldAlt, title: 'Полная безопасность', desc: 'Страховка, техосмотр и круглосуточная помощь на дороге включены', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10' },
              { icon: FaHeadset, title: 'Поддержка 24/7', desc: 'Живая поддержка в чате, по телефону и email в любое время суток', gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10' },
            ].map((feature, i) => (
              <div key={i} className="glass-card rounded-3xl p-10 text-center group relative overflow-hidden">
                {/* Hover glow */}
                <div className={`absolute inset-0 ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-7 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR VEHICLES SECTION ===== */}
      <section className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #120520 30%, #1a0a2e 50%, #120520 70%, #0a0118 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                <FaHeart className="text-orange-400 text-xs" />
                <span className="text-orange-400 font-semibold text-xs tracking-widest uppercase">Каталог</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white">
                Популярные <span className="gradient-text">авто</span>
              </h2>
            </div>
            <Link to="/vehicles" className="group flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-semibold text-sm">
              Смотреть все 
              <FaArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCars.map((car, i) => (
              <div key={i} className="glass-card rounded-3xl overflow-hidden group">
                {/* Car Image Area */}
                <div className="h-52 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-gray-900 to-gray-800/80"></div>
                  
                  {/* Colored accent glow per card */}
                  <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${
                    i === 0 ? 'bg-gradient-to-br from-orange-500/30 to-transparent' :
                    i === 1 ? 'bg-gradient-to-br from-rose-500/30 to-transparent' :
                    'bg-gradient-to-br from-violet-500/30 to-transparent'
                  }`}></div>
                  
                  <img src={car.image} alt={car.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" />
                  
                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold text-white ${
                      i === 0 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                      i === 1 ? 'bg-gradient-to-r from-rose-500 to-pink-500' :
                      'bg-gradient-to-r from-violet-500 to-purple-500'
                    }`}>
                      {car.tag}
                    </span>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 glass px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <FaStar className="text-amber-400 text-xs" />
                    <span className="text-white text-xs font-bold">{car.rating}</span>
                  </div>
                  
                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-950/90 to-transparent"></div>
                </div>

                <div className="p-6 pt-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">{car.name}</h3>
                    <span className="text-gray-600 text-xs font-medium">{car.year}</span>
                  </div>
                  <p className="text-gray-600 text-xs mb-5">{car.reviews} отзывов</p>

                  {/* Car specs */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <FaGasPump className="text-orange-500/40" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <FaCogs className="text-rose-500/40" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <FaUsers className="text-violet-500/40" />
                      <span>{car.seats} мест</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-5 border-t border-white/5">
                    <div>
                      <span className="text-2xl font-black text-white">{car.price} ₸</span>
                      <span className="text-gray-600 text-xs">/день</span>
                    </div>
                    <Link
                      to="/vehicles"
                      className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0d0820 50%, #0a0118 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <FaPlay className="text-violet-400 text-[10px]" />
              <span className="text-violet-400 font-semibold text-xs tracking-widest uppercase">Инструкция</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
              Как это <span className="gradient-text">работает</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Четыре простых шага — и вы в пути
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaSearch, step: '01', title: 'Выберите', desc: 'Найдите подходящий автомобиль в каталоге', gradient: 'from-orange-500 to-amber-500' },
              { icon: FaClock, step: '02', title: 'Забронируйте', desc: 'Выберите даты и оформите заявку', gradient: 'from-rose-500 to-pink-500' },
              { icon: FaCreditCard, step: '03', title: 'Оплатите', desc: 'Безопасная оплата онлайн', gradient: 'from-violet-500 to-purple-500' },
              { icon: FaRoute, step: '04', title: 'В путь!', desc: 'Заберите авто и наслаждайтесь', gradient: 'from-emerald-500 to-teal-500' },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 text-center group relative overflow-hidden">
                {/* Step number bg */}
                <div className="absolute -top-4 -right-4 text-[100px] font-black text-white/[0.02] leading-none select-none">
                  {item.step}
                </div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-lg`}>
                    <item.icon className="text-white text-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase">Шаг {item.step}</span>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-28 relative" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #150822 30%, #1a0530 50%, #150822 70%, #0a0118 100%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <FaStar className="text-rose-400 text-xs" />
              <span className="text-rose-400 font-semibold text-xs tracking-widest uppercase">Отзывы</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
              Что говорят <span className="gradient-text">клиенты</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Арман К.', text: 'Отличный сервис! Арендовал BMW на неделю для поездки на Алаколь, всё прошло гладко. Машина была в идеальном состоянии.', rating: 5, color: 'from-orange-500 to-amber-500' },
              { name: 'Айгерим С.', text: 'Быстрое оформление и очень удобный сайт. Служба поддержки помогла подобрать идеальный автомобиль для путешествия по Алматинской области.', rating: 5, color: 'from-rose-500 to-pink-500' },
              { name: 'Данияр В.', text: 'Пользуюсь уже третий раз. Цены адекватные, автомобили всегда чистые и технически исправные. Рекомендую всем в Астане!', rating: 5, color: 'from-violet-500 to-purple-500' },
            ].map((review, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 group">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <FaStar key={j} className="text-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${review.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{review.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{review.name}</div>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <FaCheckCircle className="text-[10px]" />
                      <span>Подтверждённый клиент</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] overflow-hidden">
            {/* Animated gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-rose-600 to-violet-600 animate-gradient"></div>
            <div className="absolute inset-0 grid-pattern opacity-20"></div>
            
            {/* Glowing orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] animate-breathe"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-[60px] animate-breathe" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 px-8 sm:px-20 py-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white/90 text-sm mb-8 backdrop-blur font-medium">
                <FaRocket className="text-xs" />
                <span>Специальное предложение</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Готовы в путь?
              </h2>
              <p className="text-lg text-white/70 mb-12 max-w-md mx-auto leading-relaxed">
                Зарегистрируйтесь и получите скидку <span className="font-bold text-white">10%</span> на первую аренду
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl shadow-black/20"
              >
                Начать бесплатно
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
