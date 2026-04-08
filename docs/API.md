# API Документация

## Базовый URL
```
http://localhost:5000/api
```

## Аутентификация

Все защищенные эндпоинты требуют JWT токен в заголовке:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Аутентификация

#### POST /auth/register
Регистрация нового пользователя

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79991234567",
  "role": "CLIENT"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов",
    "role": "CLIENT"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Вход в систему

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов",
    "role": "CLIENT"
  },
  "token": "jwt_token"
}
```

#### GET /auth/profile
Получить профиль текущего пользователя (требует авторизации)

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79991234567",
  "role": "CLIENT",
  "avatar": "url",
  "createdAt": "2026-04-08T12:00:00.000Z"
}
```

---

### Транспорт

#### GET /vehicles
Получить список транспорта с фильтрами

**Query Parameters:**
- `type` - Тип транспорта (CAR, MOTORCYCLE, BICYCLE, SCOOTER, TRUCK, VAN)
- `minPrice` - Минимальная цена
- `maxPrice` - Максимальная цена
- `location` - Локация
- `seats` - Количество мест
- `transmission` - Тип КПП (MANUAL, AUTOMATIC)
- `fuelType` - Тип топлива (PETROL, DIESEL, ELECTRIC, HYBRID)
- `search` - Поиск по марке/модели
- `page` - Номер страницы (по умолчанию 1)
- `limit` - Количество на странице (по умолчанию 12)

**Response:**
```json
{
  "vehicles": [
    {
      "id": "uuid",
      "brand": "Toyota",
      "model": "Camry",
      "year": 2024,
      "type": "CAR",
      "pricePerDay": 89.00,
      "location": "Москва",
      "averageRating": 4.8,
      "reviewCount": 124
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET /vehicles/:id
Получить детальную информацию о транспорте

**Response:**
```json
{
  "id": "uuid",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2024,
  "type": "CAR",
  "color": "Черный",
  "licensePlate": "А123БВ777",
  "seats": 5,
  "transmission": "AUTOMATIC",
  "fuelType": "PETROL",
  "pricePerDay": 89.00,
  "pricePerHour": 15.00,
  "description": "Комфортный седан для поездок по городу",
  "features": ["GPS", "AC", "Bluetooth"],
  "images": ["url1", "url2"],
  "location": "Москва",
  "status": "AVAILABLE",
  "averageRating": 4.8,
  "owner": {
    "id": "uuid",
    "firstName": "Петр",
    "lastName": "Петров"
  },
  "reviews": []
}
```

#### POST /vehicles
Создать новый транспорт (требует роль OWNER или ADMIN)

**Request Body:**
```json
{
  "type": "CAR",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2024,
  "color": "Черный",
  "licensePlate": "А123БВ777",
  "seats": 5,
  "transmission": "AUTOMATIC",
  "fuelType": "PETROL",
  "pricePerDay": 89.00,
  "description": "Комфортный седан",
  "features": ["GPS", "AC"],
  "location": "Москва"
}
```

---

### Бронирования

#### POST /bookings
Создать бронирование (требует авторизации)

**Request Body:**
```json
{
  "vehicleId": "uuid",
  "startDate": "2026-04-10T10:00:00.000Z",
  "endDate": "2026-04-15T10:00:00.000Z",
  "pickupLocation": "Москва, ул. Ленина 1",
  "dropoffLocation": "Москва, ул. Пушкина 2",
  "notes": "Дополнительные пожелания"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "vehicleId": "uuid",
  "startDate": "2026-04-10T10:00:00.000Z",
  "endDate": "2026-04-15T10:00:00.000Z",
  "totalDays": 5,
  "pricePerDay": 89.00,
  "totalPrice": 445.00,
  "status": "PENDING",
  "vehicle": {},
  "user": {}
}
```

#### GET /bookings
Получить список бронирований пользователя (требует авторизации)

**Query Parameters:**
- `status` - Статус (PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED)
- `page` - Номер страницы
- `limit` - Количество на странице

**Response:**
```json
{
  "bookings": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### POST /bookings/:id/cancel
Отменить бронирование (требует авторизации)

---

### Платежи

#### POST /payments/create-intent
Создать платежный интент (требует авторизации)

**Request Body:**
```json
{
  "bookingId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "stripe_client_secret",
  "paymentIntentId": "pi_xxx"
}
```

#### POST /payments/confirm
Подтвердить платеж (требует авторизации)

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

---

### Отзывы

#### POST /reviews
Создать отзыв (требует авторизации)

**Request Body:**
```json
{
  "vehicleId": "uuid",
  "bookingId": "uuid",
  "rating": 5,
  "comment": "Отличный автомобиль!"
}
```

#### GET /reviews/vehicle/:vehicleId
Получить отзывы транспорта

**Query Parameters:**
- `page` - Номер страницы
- `limit` - Количество на странице

---

### Админ

#### GET /admin/dashboard
Получить статистику (требует роль ADMIN)

**Response:**
```json
{
  "totalUsers": 150,
  "totalVehicles": 50,
  "totalBookings": 300,
  "totalRevenue": 50000,
  "recentBookings": [],
  "popularVehicles": []
}
```

#### GET /admin/users
Получить всех пользователей (требует роль ADMIN)

#### GET /admin/vehicles
Получить весь транспорт (требует роль ADMIN)

#### GET /admin/bookings
Получить все бронирования (требует роль ADMIN)

---

## Коды ошибок

- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера

## Формат ошибок

```json
{
  "error": "Описание ошибки"
}
```
