import React from 'react';
import { FaShieldAlt, FaCar, FaHeadset, FaRegClock } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: FaCar,
      title: 'Большой выбор',
      description: 'Более 2000 автомобилей разных классов: от эконома до премиума и внедорожников.',
    },
    {
      icon: FaShieldAlt,
      title: 'Безопасность',
      description: 'Каждый автомобиль проходит тщательную проверку перед каждой поездкой. Страховка включена.',
    },
    {
      icon: FaRegClock,
      title: 'Быстрая выдача',
      description: 'Оформление договора занимает не более 15 минут. Быстрое бронирование онлайн.',
    },
    {
      icon: FaHeadset,
      title: 'Поддержка 24/7',
      description: 'Наша служба поддержки всегда на связи, чтобы помочь вам в любой ситуации на дороге.',
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            О компании <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">RentWheels</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Мы — ведущая платформа по аренде автомобилей в Казахстане. Наша миссия — сделать процесс аренды транспорта максимально простым, прозрачным и комфортным.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 h-96">
            <img 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop" 
              alt="Luxury Car in Kazakhstan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080014] to-transparent"></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Свобода передвижения по всему Казахстану</h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Основанная в Алматы, компания RentWheels стремится изменить представление о прокате автомобилей. Мы объединяем владельцев авто и тех, кому нужен транспорт, создавая удобную и безопасную среду для всех.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Независимо от того, планируете ли вы деловую поездку в Астану, отдых на природе или просто нуждаетесь в автомобиле на выходные — у нас найдётся идеальный вариант для ваших задач.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="text-2xl text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-orange-500/20 to-rose-500/20 rounded-3xl p-12 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">2000+</div>
              <div className="text-orange-300 text-sm font-medium uppercase tracking-wider">Автомобилей</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">15k+</div>
              <div className="text-orange-300 text-sm font-medium uppercase tracking-wider">Счастливых клиентов</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">12</div>
              <div className="text-orange-300 text-sm font-medium uppercase tracking-wider">Городов РК</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white mb-2">4.9/5</div>
              <div className="text-orange-300 text-sm font-medium uppercase tracking-wider">Средняя оценка</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
