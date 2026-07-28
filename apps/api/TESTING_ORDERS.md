# Testing Completo — Bloque 3: Creación de Órdenes

Base URL: `http://localhost:4000/api`

---

## Preparación

### 1. Levantar el servidor
```bash
cd apps/api
npm run seed
npm run dev
```

### 2. Obtener token de admin (para endpoints protegidos)
```
POST http://localhost:4000/api/users/login
Content-Type: application/json

{
  "email": "admin@cheepers.com",
  "password": "admin123"
}
```
Guardar el `token` de la respuesta. Usarlo en headers de admin:
```
Authorization: Bearer <TOKEN>
```

### 3. Crear un cupón de prueba (para tests de descuento)
```
POST http://localhost:4000/api/coupons/admin
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "code": "DESCUENTO10",
  "discountPercent": 10,
  "active": true
}
```

---

## POST /api/orders — Crear Orden

### Test 1: Orden pickup válida con efectivo (POSITIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Juan Pérez",
    "phone": "+5491234567890"
  },
  "items": [
    {
      "title": "Hamburguesa Completa",
      "price": 1500,
      "quantity": 2,
      "additionals": [
        {
          "name": "Cheddar Extra",
          "price": 200,
          "quantity": 1
        }
      ]
    }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 201**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "customer": { "name": "Juan Pérez", "phone": "+5491234567890" },
    "items": [{ "title": "Hamburguesa Completa", "price": 1500, "quantity": 2, "additionals": [{ "name": "Cheddar Extra", "price": 200, "quantity": 1 }] }],
    "deliveryType": "pickup",
    "paymentMethod": "cash",
    "discountPercent": 0,
    "subtotal": 3200,
    "deliveryCost": 0,
    "total": 3200,
    "status": "pending"
  }
}
```

**Validar:**
- `subtotal = (1500 × 2) + (200 × 1) = 3200`
- `total = 3200` (sin descuento, sin envío)
- `status = "pending"`
- Guardar el `_id` para tests posteriores

---

### Test 2: Orden pickup con cupón válido (POSITIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "María García",
    "phone": "+5491987654321"
  },
  "items": [
    {
      "title": "Pizza 4 Quesos",
      "price": 3500,
      "quantity": 1,
      "additionals": []
    }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "transfer",
  "couponCode": "DESCUENTO10"
}
```

**Esperado: 201**

**Validar:**
- `discountPercent = 10`
- `subtotal = 3500`
- `total = 3500 - 350 = 3150`
- `couponCode = "DESCUENTO10"`

---

### Test 3: Orden delivery con dirección (POSITIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Carlos López",
    "phone": "+5491122334455"
  },
  "items": [
    {
      "title": "Lomito Completo",
      "price": 1900,
      "quantity": 1,
      "additionals": [
        { "name": "Doble Carne", "price": 600, "quantity": 1 },
        { "name": "Huevo Frito", "price": 300, "quantity": 2 }
      ]
    }
  ],
  "deliveryType": "delivery",
  "paymentMethod": "mercadopago",
  "deliveryAddress": "Av. Siempre Viva 123, Piso 4"
}
```

**Esperado: 201**

**Validar:**
- `subtotal = 1900 + 600 + (300 × 2) = 3100`
- `total = 3100` (deliveryCost inicia en 0, admin lo setea después)
- `delivery.address = "Av. Siempre Viva 123, Piso 4"`

---

### Test 4: Múltiples items (POSITIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Ana Martínez",
    "phone": "+5491155667788"
  },
  "items": [
    {
      "title": "Hamburguesa Doble",
      "price": 2200,
      "quantity": 1,
      "additionals": []
    },
    {
      "title": "Papas con Cheddar",
      "price": 1100,
      "quantity": 2,
      "additionals": [
        { "name": "Panceta", "price": 400, "quantity": 1 }
      ]
    },
    {
      "title": "Coca Cola 500ml",
      "price": 600,
      "quantity": 2,
      "additionals": []
    }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 201**

**Validar:**
- `subtotal = 2200 + (1100 × 2 + 400 × 1) + (600 × 2) = 2200 + 2600 + 1200 = 6000`
- `total = 6000`

---

### Test 5: Customer name muy corto (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "A",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "El nombre debe tener mínimo 2 caracteres (name)"
}
```

---

### Test 6: Teléfono muy corto (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "12345"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "El teléfono debe tener mínimo 10 dígitos (phone)"
}
```

---

### Test 7: Sin items (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "Debe haber al menos un artículo (items)"
}
```

---

### Test 8: Item sin título (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400** — título requerido

---

### Test 9: Item sin precio (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400** — precio requerido

---

### Test 10: Item con cantidad 0 (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 0 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400** — cantidad debe ser mayor a 0

---

### Test 11: Item con precio negativo (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": -50, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400** — precio no puede ser negativo

---

### Test 12: deliveryType inválido (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "dine-in",
  "paymentMethod": "cash"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "Tipo de entrega inválido (deliveryType)"
}
```

---

### Test 13: paymentMethod inválido (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "bitcoin"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "Método de pago inválido (paymentMethod)"
}
```

---

### Test 14: Delivery sin dirección (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "delivery",
  "paymentMethod": "cash"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "La dirección es requerida cuando el tipo de envío es delivery (deliveryAddress)"
}
```

---

### Test 15: Delivery con dirección vacía (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "delivery",
  "paymentMethod": "cash",
  "deliveryAddress": "   "
}
```

**Esperado: 400** — dirección requerida (trim falla)

---

### Test 16: Cupón inexistente (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash",
  "couponCode": "NOEXISTE"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "Cupón inválido: Cupón no válido"
}
```

---

### Test 17: Cupón inactivo (NEGATIVO)

Primero desactivar el cupón:
```
PATCH http://localhost:4000/api/coupons/admin/<COUPON_ID>/toggle
Authorization: Bearer <TOKEN>
```

Luego:
```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash",
  "couponCode": "DESCUENTO10"
}
```

**Esperado: 400** — cupón no válido

Reactivar después:
```
PATCH http://localhost:4000/api/coupons/admin/<COUPON_ID>/toggle
Authorization: Bearer <TOKEN>
```

---

### Test 18: Body vacío (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{}
```

**Esperado: 400** — múltiples errores de validación

---

### Test 19: JSON malformado (NEGATIVO)

```
POST http://localhost:4000/api/orders
Content-Type: application/json

{ esto no es json
```

**Esperado: 400** — error de parsing

---

### Test 20: Local cerrado (NEGATIVO)

Primero cerrar el local:
```
PUT http://localhost:4000/api/config/emergency
Authorization: Bearer <TOKEN>
```

Luego:
```
POST http://localhost:4000/api/orders
Content-Type: application/json

{
  "customer": {
    "name": "Test User",
    "phone": "+5491234567890"
  },
  "items": [
    { "title": "Test", "price": 100, "quantity": 1 }
  ],
  "deliveryType": "pickup",
  "paymentMethod": "cash"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "El local está cerrado en este momento"
}
```

Reabrir:
```
PUT http://localhost:4000/api/config/emergency
Authorization: Bearer <TOKEN>
```

---

## GET /api/orders/:id — Obtener Orden

### Test 21: Obtener orden existente (POSITIVO)

Usar el `_id` del Test 1:
```
GET http://localhost:4000/api/orders/<ORDER_ID>
```

**Esperado: 200** — retorna la orden completa con todos los campos

---

### Test 22: Obtener orden inexistente (NEGATIVO)

```
GET http://localhost:4000/api/orders/507f1f77bcf86cd799439011
```

**Esperado: 404**
```json
{
  "success": false,
  "error": "Orden no encontrada"
}
```

---

### Test 23: ID inválido (NEGATIVO)

```
GET http://localhost:4000/api/orders/abc123
```

**Esperado: 404** o error de cast de MongoDB

---

## GET /api/orders/admin/all — Obtener Todas (Admin)

### Test 24: Sin token (NEGATIVO)

```
GET http://localhost:4000/api/orders/admin/all
```

**Esperado: 401**
```json
{
  "success": false,
  "error": "No autorizado - token no encontrado"
}
```

---

### Test 25: Token inválido (NEGATIVO)

```
GET http://localhost:4000/api/orders/admin/all
Authorization: Bearer invalidtoken123
```

**Esperado: 401**
```json
{
  "success": false,
  "error": "Token inválido"
}
```

---

### Test 26: Token de usuario no-admin (NEGATIVO)

Si tenés un usuario con rol distinto a admin:
```
GET http://localhost:4000/api/orders/admin/all
Authorization: Bearer <NON_ADMIN_TOKEN>
```

**Esperado: 403**
```json
{
  "success": false,
  "error": "Acceso denegado - requiere rol admin"
}
```

---

### Test 27: Con token admin válido (POSITIVO)

```
GET http://localhost:4000/api/orders/admin/all
Authorization: Bearer <TOKEN>
```

**Esperado: 200** — array de órdenes ordenadas por `createdAt` descendente

---

## GET /api/orders/admin/status/:status — Filtrar por Estado

### Test 28: Filtrar pending (POSITIVO)

```
GET http://localhost:4000/api/orders/admin/status/pending
Authorization: Bearer <TOKEN>
```

**Esperado: 200** — solo órdenes con `status: "pending"`

---

### Test 29: Filtrar estado sin órdenes (POSITIVO)

```
GET http://localhost:4000/api/orders/admin/status/delivered
Authorization: Bearer <TOKEN>
```

**Esperado: 200** — array vacío `[]`

---

### Test 30: Estado inválido (NEGATIVO)

```
GET http://localhost:4000/api/orders/admin/status/banana
Authorization: Bearer <TOKEN>
```

**Esperado: 200** — array vacío (no filtra, no explota)

---

## PUT /api/orders/admin/:id/status — Cambiar Estado

### Test 31: Pending → Confirmed (POSITIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Esperado: 200**
```json
{
  "success": true,
  "message": "Estado actualizado",
  "data": {
    "status": "confirmed"
  }
}
```

---

### Test 32: Confirmed → Preparing (POSITIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "preparing"
}
```

**Esperado: 200** — `status: "preparing"`

---

### Test 33: Preparing → Ready (POSITIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "ready"
}
```

**Esperado: 200** — `status: "ready"`

---

### Test 34: Sin status en body (NEGATIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "El estado es requerido"
}
```

---

### Test 35: Status inválido (NEGATIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "banana"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "Estado inválido"
}
```

---

### Test 36: Orden inexistente (NEGATIVO)

```
PUT http://localhost:4000/api/orders/admin/507f1f77bcf86cd799439011/status
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Esperado: 404**
```json
{
  "success": false,
  "error": "Orden no encontrada"
}
```

---

## PUT /api/orders/admin/:id/delivery-cost — Actualizar Costo Envío

### Test 37: Setear costo de envío (POSITIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/delivery-cost
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "deliveryCost": 500
}
```

**Esperado: 200**
```json
{
  "success": true,
  "message": "Costo de envío actualizado",
  "data": {
    "deliveryCost": 500,
    "total": <subtotal - descuento + 500>
  }
}
```

**Validar:** el `total` se recalculó correctamente

---

### Test 38: Costo en 0 (POSITIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/delivery-cost
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "deliveryCost": 0
}
```

**Esperado: 200** — `deliveryCost: 0`, total recalculado

---

### Test 39: Costo negativo (NEGATIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/delivery-cost
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "deliveryCost": -100
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "El costo de envío debe ser un número positivo"
}
```

---

### Test 40: Costo no numérico (NEGATIVO)

```
PUT http://localhost:4000/api/orders/admin/<ORDER_ID>/delivery-cost
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "deliveryCost": "mil pesos"
}
```

**Esperado: 400**
```json
{
  "success": false,
  "error": "El costo de envío debe ser un número positivo"
}
```

---

### Test 41: Orden inexistente (NEGATIVO)

```
PUT http://localhost:4000/api/orders/admin/507f1f77bcf86cd799439011/delivery-cost
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "deliveryCost": 500
}
```

**Esperado: 404**
```json
{
  "success": false,
  "error": "Orden no encontrada"
}
```

---

## Resumen de Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/orders` | No | Crear orden |
| `GET` | `/api/orders/:id` | No | Obtener orden por ID |
| `GET` | `/api/orders/admin/all` | Admin | Todas las órdenes |
| `GET` | `/api/orders/admin/status/:status` | Admin | Filtrar por estado |
| `PUT` | `/api/orders/admin/:id/status` | Admin | Cambiar estado |
| `PUT` | `/api/orders/admin/:id/delivery-cost` | Admin | Actualizar costo envío |

## Estados válidos de una orden

`pending` → `confirmed` → `preparing` → `ready` → `delivered`

También: `cancelled` (desde cualquier estado)

## Métodos de pago válidos

`cash` | `transfer` | `mercadopago`

## Errores esperados

| Código | Significado |
|--------|-------------|
| 400 | Validación fallida / datos incorrectos / local cerrado / cupón inválido |
| 401 | Sin token o token inválido |
| 403 | Token válido pero no es admin |
| 404 | Orden o recurso no encontrado |
| 201 | Orden creada exitosamente |
| 200 | Operación exitosa |
