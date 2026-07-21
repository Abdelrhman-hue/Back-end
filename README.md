# 🛒 E-Commerce Backend API

A RESTful E-Commerce Backend built with **Node.js**, **Express.js**, and **MongoDB**.  
The API provides authentication, product management, shopping cart, orders, and Stripe payment integration.

---

## 🚀 Features

- 🔐 JWT Authentication
- 🍪 Cookie-based Authentication
- 👤 User Registration & Login
- 🔑 Password Reset via Email (Nodemailer)
- 🛍️ Product CRUD Operations
- 🛒 Shopping Cart
- 📦 Order Management
- 💳 Stripe Checkout Integration
- 👮 Role-Based Authorization (Admin/User)
- ✅ Input Validation
- 🌐 RESTful API
- ☁️ MongoDB Atlas Database

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Stripe
- Nodemailer
- Cookie Parser
- Express Validator
- CORS

---

## 📂 Project Structure

```
.
├── controllers/
├── middleware/
├── models/
├── utils/
├── index.js
├── package.json
└── .env
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
```

Move into the project directory

```bash
cd your-repository
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DATABASE=your_mongodb_connection_string
JWT_SECRET=your_secret_key

EMAIL=your_email
EMAIL_PASSWORD=your_email_password

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

Run the server

```bash
npm start
```

or

```bash
npm run dev
```

---

# API Endpoints

## Products

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| POST | `/products/add` | Add product (Admin) |
| PATCH | `/products/update/:id` | Update product (Admin) |
| DELETE | `/products/delete/:id` | Delete product (Admin) |

---

## Users

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/me` | Get current user |
| POST | `/users/register` | Register |
| POST | `/users/login` | Login |
| POST | `/users/logout` | Logout |
| POST | `/users/reset-password` | Send reset code |
| POST | `/users/verify-reset-code` | Verify reset code |
| PATCH | `/users/update/:id` | Update user (Admin) |
| DELETE | `/users/delete/:id` | Delete user (Admin) |

---

## Cart

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/cart` | Add product to cart |
| GET | `/Mycart` | Get current user's cart |

---

## Orders

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders/me` | Get my orders |

---

## Payments

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/payment/checkout` | Create Stripe Checkout Session |
| POST | `/payment/webhook` | Stripe Webhook |
| GET | `/payment/verify/:id` | Verify Payment |

---

## 🔒 Authentication

Protected routes require a valid JWT stored in an HTTP-only Cookie.

Authentication middleware:

- JWT Verification
- Role Authorization
- Get Current User

---

## 👮 Authorization

Admin-only routes include:

- Add Product
- Update Product
- Delete Product
- Update User
- Delete User

---

## 🌍 Environment Variables

```env
DATABASE=
JWT_SECRET=

EMAIL=
EMAIL_PASSWORD=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 📌 Future Improvements

- Product Search
- Product Reviews
- Wishlist
- Coupons & Discounts
- Pagination & Filtering
- Image Upload
- Order Tracking

---

## 👨‍💻 Author

**Abdelrhman Safwat**

GitHub: https://github.com/Abdelrhman-hue   

# 📖 API Documentation

## Base URL

```
https://your-backend-url.up.railway.app
```

---

# Authentication

## Register

### POST

```
/users/register
```

### Body

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "status": "success",
  "message": "User registered successfully"
}
```

---

## Login

### POST

```
/users/login
```

### Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "status": "success",
  "token": "JWT_TOKEN"
}
```

---

# Products

## Get All Products

### GET

```
/products
```

---

## Get Single Product

### GET

```
/products/:id
```

---

## Add Product (Admin)

### POST

```
/products/add
```

Headers

```
Cookie: token=JWT
```

Body

```json
{
  "title": "iPhone 15",
  "description": "Apple Phone",
  "price": 1200,
  "category": "phones"
}
```

---

## Update Product

### PATCH

```
/products/update/:id
```

---

## Delete Product

### DELETE

```
/products/delete/:id
```

---

# Cart

## Add To Cart

### POST

```
/cart
```

Body

```json
{
  "productId": "...",
  "quantity": 2
}
```

---

## Get My Cart

### GET

```
/Mycart
```

---

# Orders

## Create Order

### POST

```
/orders
```

---

## Get My Orders

### GET

```
/orders/me
```

---

# Payments

## Create Checkout Session

### POST

```
/payment/checkout
```

---

## Stripe Webhook

### POST

```
/payment/webhook
```

---

## Verify Payment

### GET

```
/payment/verify/:id
```
# 🏗️ System Architecture

```text
                         +----------------------+
                         |      Frontend        |
                         |   Next.js / React    |
                         +----------+-----------+
                                    |
                              HTTP Requests
                                    |
                                    v
                     +------------------------------+
                     |      Express.js Backend       |
                     |         RESTful API           |
                     +------------------------------+
                       |          |          |
                       |          |          |
               JWT Auth|          |Stripe    |Email
                       |          |          |
                       v          v          v
                +-----------+ +--------+ +-------------+
                | MongoDB   | | Stripe | | Nodemailer  |
                |  Atlas    | | API    | | Gmail SMTP  |
                +-----------+ +--------+ +-------------+
```

---

## Backend Flow

```text
Client
   │
   ▼
Express Server
   │
   ├──────── Authentication
   │         │
   │         ▼
   │     JWT Middleware
   │
   ├──────── Product Controller
   │
   ├──────── User Controller
   │
   ├──────── Cart Controller
   │
   ├──────── Order Controller
   │
   └──────── Payment Controller
                  │
                  ▼
             Stripe Checkout
```

---

## Authentication Flow

```text
Register
   │
   ▼
Hash Password (bcrypt)
   │
   ▼
MongoDB

──────────────

Login
   │
   ▼
Compare Password
   │
   ▼
Generate JWT
   │
   ▼
HTTP Only Cookie
   │
   ▼
Protected Routes
```

---

## Payment Flow

```text
User
 │
 ▼
Checkout
 │
 ▼
Stripe Checkout Session
 │
 ▼
Stripe Payment
 │
 ▼
Webhook
 │
 ▼
Verify Payment
 │
 ▼
Create Order
```

---
