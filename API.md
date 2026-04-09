# API Документация (Vehicle Rental Platform)

Здесь приведены примеры того, как обращаться к основным эндпоинтам нашего API.
Базовый URL: `http://localhost:5005/api`

---

## 1. Аутентификация (Auth)

### Регистрация клиента
Регистрирует нового пользователя. 

**POST** `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "mypassword123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79991234567"
}
```
**cURL пример:**
```bash
curl -X POST http://localhost:5005/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"mypassword123","firstName":"Иван","lastName":"Иванов"}'
```

### Логин
Получение JWT токена.

**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

---

## 2. Транспорт (Vehicles)

### Получить список автомобилей (с фильтрацией)
Возвращает список доступных транспортных средств.
**Параметры URL:** `type`, `minPrice`, `maxPrice`, `seats`

**GET** `/vehicles?type=CAR&minPrice=1000`
**cURL пример:**
```bash
curl -X GET "http://localhost:5005/api/vehicles?type=CAR&limit=10"
```

### Добавить автомобиль
Доступно только владельцам/админам (Нужен JWT Bearer токен).

**POST** `/vehicles`
```json
{
  "type": "CAR",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2021,
  "color": "Черный",
  "licensePlate": "A123BC",
  "seats": 5,
  "transmission": "AUTOMATIC",
  "fuelType": "PETROL",
  "pricePerDay": 3500,
  "description": "Отличный комфортный седан",
  "location": "Москва"
}
```

---

## 3. Бронирование (Bookings)

### Создать бронь
Требуется авторизация (Bearer JWT).

**POST** `/bookings`
```json
{
  "vehicleId": "id-транспорта-здесь",
  "startDate": "2026-05-10T10:00:00.000Z",
  "endDate": "2026-05-15T15:00:00.000Z",
  "pickupLocation": "Москва, ул. Ленина 1"
}
```
**cURL пример:**
```bash
curl -X POST http://localhost:5005/api/bookings \
-H "Content-Type: application/json" \
-H "Authorization: Bearer ТВОЙ_JWT_ТОКЕН_ЗДЕСЬ" \
-d '{"vehicleId":"123","startDate":"2026-05-10T10...","endDate":"2026-05-12T10...","pickupLocation":"Москва"}'
```

### Список моих бронирований
**GET** `/bookings?status=CONFIRMED`
*(передайте заголовок Authorization)*
