# Информационная система для онлайн-аренды транспортных средств

Полнофункциональная веб-платформа для аренды транспортных средств с **JSON базой данных** (без PostgreSQL).

## 🚀 Технологический стек

### Backend
- **Node.js** + **Express.js** - серверная часть
- **TypeScript** - типизация
- **JSON файлы** - база данных (не требуется PostgreSQL!)
- **JWT** - аутентификация и авторизация
- **Stripe** - платежная система
- **Nodemailer** - отправка email уведомлений
- **Multer** - загрузка файлов

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **React Router** - маршрутизация
- **React Query** - управление состоянием сервера
- **Zustand** - глобальное состояние
- **React DatePicker** - выбор дат
- **React Hot Toast** - уведомления
- **React Icons** - иконки

## 📋 Функциональность

### Для клиентов
- ✅ Регистрация и авторизация (JWT)
- ✅ Просмотр каталога транспорта с фильтрами
- ✅ Поиск по марке, модели, локации
- ✅ Детальная информация о транспорте
- ✅ Система бронирования с выбором дат
- ✅ Проверка доступности транспорта
- ✅ Онлайн-оплата через Stripe
- ✅ Личный кабинет
- ✅ История бронирований
- ✅ Система отзывов и рейтингов
- ✅ Избранное
- ✅ Email уведомления

### Для владельцев транспорта
- ✅ Добавление транспорта в систему
- ✅ Управление своим транспортом
- ✅ Просмотр бронирований
- ✅ Управление доступностью

### Для администраторов
- ✅ Панель управления
- ✅ Управление пользователями
- ✅ Управление транспортом
- ✅ Просмотр всех бронирований
- ✅ Статистика и аналитика
- ✅ Управление платежами

## 🗄️ Структура базы данных (JSON)

База данных хранится в JSON файлах в папке `backend/data/`:

- **users.json** - пользователи системы
- **vehicles.json** - транспортные средства
- **bookings.json** - бронирования
- **payments.json** - платежи
- **reviews.json** - отзывы
- **favorites.json** - избранное
- **notifications.json** - уведомления
- **unavailable-dates.json** - недоступные даты

## 🛠️ Установка и запуск

### Требования
- Node.js 18+
- npm или yarn
- **PostgreSQL НЕ требуется!**

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd vehicle-rental-system
```

### 2. Установка зависимостей

```bash
# Установка всех зависимостей
npm run install:all
```

Или отдельно:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Настройка окружения

#### Backend (.env)
Создайте файл `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Stripe (опционально для тестирования)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (опционально)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@vehiclerental.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

#### Frontend (.env)
Создайте файл `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Запуск приложения

#### Запуск всего проекта
```bash
npm run dev
```

Или отдельно:

#### Backend
```bash
cd backend
npm run dev
```
Сервер запустится на http://localhost:5000

#### Frontend
```bash
cd frontend
npm run dev
```
Приложение откроется на http://localhost:5173

**База данных создастся автоматически при первом запуске!**

## 📁 Структура проекта

```
vehicle-rental-system/
├── backend/
│   ├── src/
│   │   ├── middleware/       # Middleware (auth, validation)
│   │   ├── routes/           # API маршруты
│   │   ├── services/         # Бизнес-логика
│   │   ├── utils/            # Утилиты (database.ts)
│   │   └── index.ts          # Точка входа
│   ├── data/                 # JSON база данных (создается автоматически)
│   │   ├── users.json
│   │   ├── vehicles.json
│   │   ├── bookings.json
│   │   └── ...
│   ├── tests/                # Тесты
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React компоненты
│   │   ├── pages/            # Страницы
│   │   ├── services/         # API клиент
│   │   ├── store/            # Zustand store
│   │   ├── App.tsx           # Главный компонент
│   │   └── main.tsx          # Точка входа
│   └── package.json
└── package.json              # Root package.json
```

## 🔌 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/profile` - Получить профиль
- `PUT /api/auth/profile` - Обновить профиль
- `POST /api/auth/change-password` - Изменить пароль

### Транспорт
- `GET /api/vehicles` - Список транспорта (с фильтрами)
- `GET /api/vehicles/:id` - Детали транспорта
- `POST /api/vehicles` - Создать транспорт (Owner/Admin)
- `PUT /api/vehicles/:id` - Обновить транспорт
- `DELETE /api/vehicles/:id` - Удалить транспорт
- `POST /api/vehicles/:id/check-availability` - Проверить доступность

### Бронирования
- `POST /api/bookings` - Создать бронирование
- `GET /api/bookings` - Список бронирований
- `GET /api/bookings/:id` - Детали бронирования
- `PATCH /api/bookings/:id/status` - Обновить статус
- `POST /api/bookings/:id/cancel` - Отменить бронирование

### Платежи
- `POST /api/payments/create-intent` - Создать платежный интент
- `POST /api/payments/confirm` - Подтвердить платеж
- `POST /api/payments/webhook` - Webhook от Stripe

### Отзывы
- `POST /api/reviews` - Создать отзыв
- `GET /api/reviews/vehicle/:vehicleId` - Отзывы транспорта
- `PUT /api/reviews/:id` - Обновить отзыв
- `DELETE /api/reviews/:id` - Удалить отзыв

### Пользователь
- `GET /api/users/favorites` - Избранное
- `POST /api/users/favorites/:vehicleId` - Добавить в избранное
- `DELETE /api/users/favorites/:vehicleId` - Удалить из избранного
- `GET /api/users/notifications` - Уведомления

### Админ
- `GET /api/admin/dashboard` - Статистика
- `GET /api/admin/users` - Все пользователи
- `GET /api/admin/vehicles` - Все транспорты
- `GET /api/admin/bookings` - Все бронирования
- `GET /api/admin/revenue` - Статистика доходов

## 🧪 Тестирование

```bash
# Backend тесты
cd backend
npm test

# Frontend тесты
cd frontend
npm test
```

## 🏗️ Сборка для продакшена

```bash
# Сборка всего проекта
npm run build

# Или отдельно
cd backend && npm run build
cd frontend && npm run build
```

## 📝 Роли пользователей

1. **CLIENT** - Клиент (арендует транспорт)
2. **OWNER** - Владелец (сдает транспорт в аренду)
3. **ADMIN** - Администратор (полный доступ)

## 🔐 Безопасность

- JWT токены для аутентификации
- Bcrypt для хеширования паролей
- Валидация данных на сервере
- CORS настроен
- Безопасные платежи через Stripe

## 📱 Responsive дизайн

Приложение полностью адаптировано для:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎨 UI/UX особенности

- Современный дизайн с Tailwind CSS
- Плавные анимации и переходы
- Интуитивная навигация
- Toast уведомления
- Загрузочные состояния
- Обработка ошибок

## ⚡ Преимущества JSON базы данных

- ✅ **Не требуется установка PostgreSQL**
- ✅ **Простая настройка** - работает сразу после npm install
- ✅ **Легко читать и редактировать** данные
- ✅ **Идеально для разработки и тестирования**
- ✅ **Портативность** - можно легко перенести на другой компьютер
- ✅ **Нет миграций** - структура данных гибкая

## 📄 Лицензия

MIT

## 👨‍💻 Автор

Дипломная работа - Информационная система для онлайн-аренды транспортных средств

## 📞 Поддержка

Для вопросов и предложений: info@vehiclerental.com

---

## 🎓 Для дипломной работы

Проект полностью соответствует требованиям:
- ✅ Сбор и анализ требований
- ✅ Проектирование архитектуры (REST API, структура данных)
- ✅ Реализация с современными технологиями
- ✅ Готов к тестированию
- ✅ Документация (README, API docs, инструкция по установке)

**Особенность:** Использует JSON базу данных вместо PostgreSQL, что упрощает установку и демонстрацию проекта!
