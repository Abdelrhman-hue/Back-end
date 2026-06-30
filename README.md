# E-commerce Back-end

A simple E-commerce backend built with Node.js and Express, using MongoDB for data storage. It exposes REST API endpoints for user management (register, login, reset password, roles) and product management. Authentication is JWT-based and stored in cookies.

## Stack
- Language: JavaScript (Node.js)
- Framework: Express
- Database: MongoDB (Mongoose)
- Notable libraries: bcrypt (password hashing), jsonwebtoken (JWT), cookie-parser, cors, nodemailer

## Project structure
```
index.js                 # App entry: express setup, DB connection, route registration
controllers/             # Request handlers / business logic
  controllerUser.js
  controllersProdect.js
middleware/              # Middlewares: authentication, get current user, role checks
  Auth.js
  getMe.js
  rolesAuth.js
module/                  # Mongoose schemas
  usersShcema.js
  productShcema.js
routes/                  # Route definitions (routes.js currently present)
utils/                   # Helper utilities: token generation, email/code sending, roles, http responses
  generateToken.js
  sendCode.js
  httpjsend.js
  roles.js
package.json
README.md
```

## How it works (brief)
- index.js initializes Express, applies middlewares (JSON parsing, cookie-parser, CORS), connects to MongoDB (via env var), and registers user/product routes which call controller functions.
- Auth middleware checks the JWT token from cookies (cookie name: `token`) and enforces protected routes. Role-based checks (e.g., ADMIN) are enforced via rolesAuth middleware.
- Mongoose schemas for User and Product live in the `module/` folder.

## Run locally
1. Clone and enter the project:
   git clone https://github.com/Abdelrhman-hue/Back-end.git
   cd Back-end

2. Install dependencies:
   npm install

3. Create a `.env` file in the project root with at least:
   DATABASE=<your-mongodb-connection-string>
   PORT=5000
   JWT_SECRET=<your-jwt-secret>
   EMAIL_USER=<smtp-email>
   EMAIL_PASS=<smtp-password-or-app-password>

4. Start the server:
   node index.js
   or
   npm start

The server listens on process.env.PORT (default 5000 if not set).

## Environment / Notes
- MongoDB connection string is required (DATABASE).
- JWT secret is required for signing tokens.
- SMTP credentials are required for password reset / email sending (utils/sendCode.js).
- Passwords are hashed with bcrypt before storage.
- Tokens are set in cookies with name `token`.

## API overview (summary)
Products (controllersProdect):
- GET /products
  - Retrieve products (supports query params like page, limit)
- GET /products/:id
  - Retrieve a single product
- POST /products/add
  - Add a new product (protected — ADMIN)
- PATCH /products/update/:id
  - Update a product (protected — ADMIN)
- DELETE /products/delete/:id
  - Delete a product (protected — ADMIN)

Users (controllerUser):
- GET /users
  - Get all users (protected)
- GET /users/me
  - Get current user (uses getMe middleware)
- GET /users/:id
  - Get a user by id
- POST /users/login
  - Login user — sets JWT cookie `token`
- POST /users/register
  - Register a new user (password hashed)
- POST /users/reset-password
  - Start password reset (generate & email code)
- POST /users/verify-reset-code
  - Verify reset code and set a new password
- PATCH /users/update/:id
  - Update a user
- DELETE /users/delete/:id
  - Delete a user

## Quick examples (curl)
- Register:
  curl -X POST http://localhost:5000/users/register \
    -H "Content-Type: application/json" \
    -d '{"email":"a@b.com","password":"pass","firstname":"Ali","lastname":"A"}'

- Login (saves cookie to cookies.txt):
  curl -X POST http://localhost:5000/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"a@b.com","password":"pass"}' -c cookies.txt

- Get products:
  curl http://localhost:5000/products

## Next steps I can help with
- Add a `.env.example` file listing required environment variables.
- Create a Postman collection or OpenAPI spec for the endpoints.
- Commit this README.md directly to the repository if you want me to.
