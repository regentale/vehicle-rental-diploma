import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCreditCard, FaLock, FaCheck, FaArrowRight } from 'react-icons/fa';

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Демо-цена для примера
  const totalAmount = 125000;

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Введите корректный номер карты');
      return;
    }
    if (!cardHolder) {
      toast.error('Укажите имя держателя карты');
      return;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      toast.error('Введите корректную дату истечения');
      return;
    }
    if (!cvv || cvv.length !== 3) {
      toast.error('Введите корректный CVV');
      return;
    }

    setIsProcessing(true);

    // Имитируем сетевой запрос
    setTimeout(() => {
      // В демо-режиме всегда успешно (кроме тестовых номеров для демо)
      if (cardNumber.replace(/\s/g, '') === '4242424242424242') {
        setPaymentSuccess(true);
        toast.success('Платёж успешно обработан! (ДЕМО)');
      } else {
        toast.error('Платёж отклонён (ДЕМО-режим)');
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen py-8 pt-24 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
        <div className="max-w-md mx-auto px-4">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
              <FaCheck className="text-4xl text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Платёж выполнен!</h2>
            <p className="text-gray-500 mb-6">Бронирование подтверждено. Спасибо за выбор RentWheels.</p>

            <div className="glass rounded-xl p-4 mb-6 text-left">
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">ID бронирования:</span>
                <span className="font-mono text-orange-400 font-bold">{bookingId}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Сумма платежа:</span>
                <span className="font-bold text-white">{totalAmount.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Статус:</span>
                <span className="text-emerald-400 font-bold">Оплачено ✓</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-6">
              Детали бронирования отправлены на вашу почту.
              <br />
              Для дипломной работы это демо-платёж.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Перейти в личный кабинет <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pt-24" style={{ background: 'linear-gradient(180deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white mb-2">
          Оплата <span className="gradient-text">заказа</span>
        </h1>
        <p className="text-gray-500 mb-8">ID бронирования: <span className="text-orange-400 font-mono">{bookingId}</span></p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                  <FaCreditCard className="text-white text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-white">Данные карты</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                    Номер карты
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Демо: используйте <span className="font-mono text-orange-400">4242 4242 4242 4242</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                    Имя держателя карты
                  </label>
                  <input
                    type="text"
                    placeholder="IVAN PETROV"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                      Дата истечения
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="glass rounded-xl p-4 flex items-start gap-3">
                  <FaLock className="text-emerald-400 text-lg flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-white font-semibold mb-1">Безопасная оплата</p>
                    <p className="text-gray-500 text-xs">
                      Ваши данные защищены и зашифрованы. Это демо-платёж для целей дипломной работы.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary py-3.5 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Обработка платежа...
                    </>
                  ) : (
                    <>
                      Оплатить {totalAmount.toLocaleString()} ₸
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">Сводка платежа</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Стоимость аренды:</span>
                  <span className="text-white font-semibold">100 000 ₸</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Сборка платформы:</span>
                  <span className="text-white font-semibold">15 000 ₸</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Страховка:</span>
                  <span className="text-white font-semibold">10 000 ₸</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-white">К оплате:</span>
                <span className="text-3xl font-black gradient-text-alt">{totalAmount.toLocaleString()} ₸</span>
              </div>

              <div className="glass rounded-xl p-3 text-xs">
                <p className="text-gray-500 mb-2">
                  ⚠️ <span className="text-yellow-400 font-semibold">Демо-режим</span>
                </p>
                <p className="text-gray-600">
                  Это платежная форма для дипломной работы. Реальных транзакций не будет.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
