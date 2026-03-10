# WDC Authentication System
## Induction Task 2026 - Web Development Cell, NIT Patna

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready, secure authentication system built with Node.js, Express, and MongoDB. Features bcrypt password hashing, JWT with HTTP-only cookies, rate limiting, and comprehensive input validation.

---

## 🚀 Features

### Core Requirements ✅
- **Secure Signup API** - User registration with encrypted password storage
- **Secure Login API** - Authentication with JWT token generation
- **Bcrypt Password Hashing** - Industry-standard password encryption (12 salt rounds)
- **Strict Input Validation** - Comprehensive validation using express-validator

### Bonus Features ⭐
- **Rate Limiting** - Prevents brute force attacks (5 attempts per 15 minutes on auth endpoints)
- **HTTP-Only Cookies** - Secure token storage preventing XSS attacks
- **Same-Site Cookie Protection** - CSRF attack prevention
- **Account Locking** - Automatic account lock after 5 failed login attempts

### Security Features 🔒
- **Helmet.js** - Security HTTP headers
- **CORS Protection** - Configured cross-origin resource sharing
- **NoSQL Injection Prevention** - Input sanitization
- **XSS Protection** - Cross-site scripting prevention
- **Password Complexity Requirements** - Enforced strong passwords
- **Environment Variable Management** - Secure configuration

### Additional Features 🎯
- Account lockout mechanism
- Login attempt tracking
- Password update functionality
- User profile endpoint
- Comprehensive error handling
- Request logging
- MongoDB indexing for performance

---

## 📋 Requirements

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0
- **npm** or **yarn**

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
cd "c:\Users\harsh\OneDrive\Desktop\WDC\Authentication System"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/wdc_auth_system

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

BCRYPT_SALT_ROUNDS=12

CORS_ORIGIN=http://localhost:3000
```

### 4. Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 5. Run the Application

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. **Signup** (Register New User)
- **Endpoint:** `POST /api/auth/signup`
- **Rate Limit:** 5 requests per 15 minutes
- **Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-03-10T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. **Login**
- **Endpoint:** `POST /api/auth/login`
- **Rate Limit:** 5 requests per 15 minutes
- **Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 3. **Logout**
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Private (Requires Authentication)

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 4. **Get Current User**
- **Endpoint:** `GET /api/auth/me`
- **Access:** Private

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "lastLogin": "2026-03-10T10:30:00.000Z"
    }
  }
}
```

#### 5. **Update Password**
- **Endpoint:** `PUT /api/auth/update-password`
- **Rate Limit:** 3 requests per hour (strict)
- **Access:** Private

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

## 🔒 Security Features Details

### 1. Password Security
- **Bcrypt hashing** with 12 salt rounds
- **Minimum 8 characters** required
- **Complexity requirements:**
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

### 2. Rate Limiting
- **Authentication endpoints:** 5 requests per 15 minutes
- **Password update:** 3 requests per hour
- **General API:** 100 requests per 15 minutes

### 3. HTTP-Only Cookies
- Token stored in HTTP-only cookie (not accessible via JavaScript)
- SameSite=Strict (CSRF protection)
- Secure flag in production (HTTPS only)
- 7-day expiration

### 4. Account Protection
- Automatic account lock after 5 failed login attempts
- 2-hour lockout period
- Login attempt tracking

### 5. Input Validation
- Email format validation
- Password strength validation
- XSS prevention
- NoSQL injection prevention
- Request sanitization

---

## 📁 Project Structure

```
Authentication System/
├── controllers/
│   └── authController.js      # Authentication logic
├── middleware/
│   ├── auth.js                # JWT authentication middleware
│   ├── rateLimiter.js         # Rate limiting configuration
│   ├── validator.js           # Input validation rules
│   └── errorHandler.js        # Global error handler
├── models/
│   └── User.js                # User schema with bcrypt
├── routes/
│   └── authRoutes.js          # Authentication routes
├── utils/
│   └── jwtUtils.js            # JWT token utilities
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── server.js                  # Express server setup
└── README.md                  # Documentation
```

---

## 🧪 Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"SecurePass123!\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"email\":\"john@example.com\",\"password\":\"SecurePass123!\"}"
```

**Get Current User (using cookie):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Using Postman

1. Import the endpoints
2. For protected routes, the cookie is automatically sent if you use the same session
3. Or manually set the Authorization header: `Bearer <token>`

---

## 🚨 Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Authentication Failed)
- `403` - Forbidden (Insufficient Permissions)
- `423` - Locked (Account Locked)
- `429` - Too Many Requests (Rate Limit Exceeded)
- `500` - Internal Server Error

---

## 🎯 Performance Optimizations

- **Database Indexing** - Email field indexed for faster queries
- **Password Selection** - Password excluded from queries by default
- **Connection Pooling** - MongoDB connection optimization
- **Request Body Limiting** - 10KB limit on request body size
- **Efficient Hashing** - Bcrypt with optimal salt rounds (12)

---

## 🏗️ Scalability Considerations

This system is designed to handle high traffic (100,000+ users):

1. **Stateless Authentication** - JWT allows horizontal scaling
2. **Database Indexing** - Optimized query performance
3. **Rate Limiting** - Prevents server overload
4. **Async Operations** - Non-blocking I/O
5. **Efficient Password Hashing** - Balanced security and performance
6. **Connection Management** - Proper database connection handling

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB service
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

### Port Already in Use
Change the PORT in `.env` file or kill the process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 📚 Dependencies

### Production Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT implementation
- `express-validator` - Input validation
- `express-rate-limit` - Rate limiting
- `cookie-parser` - Cookie parsing
- `helmet` - Security headers
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `express-mongo-sanitize` - NoSQL injection prevention
- `xss-clean` - XSS prevention

### Development Dependencies
- `nodemon` - Auto-restart on file changes

---

## 👤 Author

**WDC Induction Candidate**  
Web Development Cell, NIT Patna

---

## 📝 License

MIT License - Feel free to use this project for learning and development.

---

## 🌟 Acknowledgments

Built for the Web Development Cell Induction Task 2026 at NIT Patna.

**Reference:** [https://wdc.nitp.ac.in/](https://wdc.nitp.ac.in/)

---

## 📞 Support

For issues, questions, or contributions, please refer to the Web Development Cell guidelines.

---

**Design · Develop · Deploy** 🚀
