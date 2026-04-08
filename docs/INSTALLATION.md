# Руководство по установке

## Системные требования

- Node.js 18.x или выше
- PostgreSQL 14.x или выше
- npm 9.x или yarn 1.22.x
- Git

## Шаг 1: Установка PostgreSQL

### Windows
1. Скачайте PostgreSQL с официального сайта: https://www.postgresql.org/download/windows/
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя postgres
4. После установки откройте pgAdmin или командную строку

### Создание базы данных
```sql
CREATE DATABASE vehicle_rental;
```

## Шаг 2: Клонирование проекта

```bash
git clone <repository-url>
cd vehicle-rental-system
```

## Шаг 3: Установка зависимостей

### Вариант 1: Установка всех зависимостей сразу
```bash
npm run install:all
```

### Вариант 2: Установка по отдельности

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## Шаг 4: Настройка переменных окружения

### Backend

Создайте файл `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/vehicle_rental?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Stripe (получите ключи на https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (настройте Gmail App Password)
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

### Frontend

Создайте файл `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Шаг 5: Настройка базы данных

```bash
cd backend

# Генерация Prisma Client
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Открыть Prisma Studio (опционально)
npm run prisma:studio
```

## Шаг 6: Запуск приложения

### Вариант 1: Запуск всего проекта
```bash
# Из корневой директории
npm run dev
```

### Вариант 2: Запуск по отдельности

#### Терминал 1 - Backend
```bash
cd backend
npm run dev
```
Backend запустится на http://localhost:5000

#### Терминал 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend откроется на http://localhost:5173

## Шаг 7: Проверка работы

1. Откройте браузер и перейдите на http://localhost:5173
2. Вы должны увидеть главную страницу приложения
3. Попробуйте зарегистрироваться

## Настройка Stripe (для платежей)

1. Зарегистрируйтесь на https://stripe.com
2. Перейдите в Dashboard → Developers → API keys
3. Скопируйте Secret key и вставьте в `.env` как `STRIPE_SECRET_KEY`
4. Для тестирования используйте тестовые карты:
   - Номер: 4242 4242 4242 4242
   - Дата: любая будущая
   - CVC: любые 3 цифры

## Настройка Email (Gmail)

1. Войдите в свой Gmail аккаунт
2. Перейдите в Настройки → Безопасность
3. Включите двухфакторную аутентификацию
4. Создайте App Password:
   - Перейдите в "Пароли приложений"
   - Выберите "Почта" и "Другое устройство"
   - Скопируйте сгенерированный пароль
5. Вставьте пароль в `.env` как `EMAIL_PASSWORD`

## Возможные проблемы

### Ошибка подключения к базе данных
- Проверьте, что PostgreSQL запущен
- Проверьте правильность DATABASE_URL в .env
- Убедитесь, что база данных создана

### Ошибка "Cannot find module"
```bash
# Удалите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Порт уже занят
```bash
# Измените PORT в backend/.env на другой (например, 5001)
PORT=5001
```

### Prisma ошибки
```bash
cd backend
npx prisma generate
npx prisma migrate reset
```

## Следующие шаги

1. Изучите документацию API: `docs/API.md`
2. Ознакомьтесь со структурой проекта в `README.md`
3. Начните разработку!

## Полезные команды

```bash
# Просмотр логов
npm run dev

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Открыть Prisma Studio
cd backend && npm run prisma:studio
```
