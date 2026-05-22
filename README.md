# Issue Tracker API

A secure and scalable Issue Tracker REST API built with **TypeScript**, **Express.js**, **PostgreSQL**, and **JWT Authentication**.  
This project follows the Level-2 assignment requirements including modular architecture, raw SQL queries using `pg`, role-based authorization, and Vercel deployment support.

---

# Live API

https://assignment2-alpha-six.vercel.app

---

# API Base URL

https://assignment2-alpha-six.vercel.app/api

---

# GitHub Repository

https://github.com/ALAMIN761740/LEVEL-02-Assignment-2

---

# Features

- JWT Authentication System
- Password Hashing with bcrypt
- Role-Based Authorization (`contributor`, `maintainer`)
- Create, Read, Update, Delete Issues
- Raw SQL Queries using PostgreSQL (`pg`)
- Global Error Handling
- Modular & Scalable Architecture
- TypeScript Support
- Vercel Deployment Ready

---

# Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- JWT (`jsonwebtoken`)
- bcrypt
- Vercel

---

# Quick Start

## 1. Clone Repository

```bash
git clone https://github.com/ALAMIN761740/LEVEL-02-Assignment-2.git

cd LEVEL-02-Assignment-2
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

DATABASE_URL=postgresql://user:password@host:5432/dbname

JWT_SECRET=your_jwt_secret

JWT_REFRESH_SECRET=your_refresh_secret
```

---

## 4. Run Development Server

```bash
npm run dev
```

---

## 5. Build Project

```bash
npm run build
```

---

## 6. Start Production Server

```bash
npm start
```

---

# Environment & Deployment Notes

- The project supports both `DATABASE_URL` and `CONNECTION_STRING`
- Vercel production deployments require environment variables manually added in project settings

Required environment variables:

```env
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
PORT (optional)
```

---

# API Endpoints

## Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |

---

## Issue Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/issues` | Create issue (Protected) |
| GET | `/api/issues` | Get all issues |
| GET | `/api/issues/:id` | Get single issue |
| PATCH | `/api/issues/:id` | Update issue (Protected) |
| DELETE | `/api/issues/:id` | Delete issue (Maintainer only) |

---

# Live API Examples

## Signup

```http
POST https://assignment2-alpha-six.vercel.app/api/auth/signup
```

---

## Login

```http
POST https://assignment2-alpha-six.vercel.app/api/auth/login
```

---

## Get All Issues

```http
GET https://assignment2-alpha-six.vercel.app/api/issues
```

---

## Create Issue

```http
POST https://assignment2-alpha-six.vercel.app/api/issues
```

---

# Authorization

Protected routes require JWT token in request headers:

```http
Authorization: YOUR_JWT_TOKEN
```

---

# Example Request Body

## Create Issue

```json
{
  "title": "Bug: Login button fails",
  "description": "Server crashes when login button is clicked",
  "type": "bug"
}
```

---

# Example Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": {
      "id": 1,
      "name": "Al Amin",
      "role": "contributor"
    }
  }
}
```

---

# cURL Examples

## Signup

```bash
curl -X POST https://assignment2-alpha-six.vercel.app/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com","password":"123456"}'
```

---

## Login

```bash
curl -X POST https://assignment2-alpha-six.vercel.app/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com","password":"123456"}'
```

---

## Get All Issues

```bash
curl https://assignment2-alpha-six.vercel.app/api/issues
```

---

## Create Issue

```bash
curl -X POST https://assignment2-alpha-six.vercel.app/api/issues \
-H "Content-Type: application/json" \
-H "Authorization: YOUR_JWT_TOKEN" \
-d '{"title":"Bug","description":"Issue details","type":"bug"}'
```

---

# Postman Testing Guide

## Authentication Flow

1. Register using `/api/auth/signup`
2. Login using `/api/auth/login`
3. Copy returned JWT token
4. Add token to Authorization header
5. Test protected issue routes

---

# Database Schema

## users table

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) |
| email | VARCHAR(100) UNIQUE |
| password | VARCHAR(255) |
| role | VARCHAR(20) |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## issues table

| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| title | VARCHAR(150) |
| description | TEXT |
| type | VARCHAR(30) |
| status | VARCHAR(30) |
| reporter_id | INT |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# Project Structure

```bash
src/
│
├── config/
├── db/
├── middleware/
├── modules/
│   ├── auth/
│   └── issue/
├── utils/
├── app.ts
└── server.ts
```

---

# Assignment Checklist

- [x] Modular architecture
- [x] Raw SQL queries
- [x] PostgreSQL integration
- [x] JWT authentication
- [x] Role-based authorization
- [x] Password hashing with bcrypt
- [x] Global error handling
- [x] Vercel deployment support
- [x] TypeScript implementation

---

# Best Practices Used

- `catchAsync` wrapper for async controllers
- Centralized global error handler
- Modular folder structure
- Environment variable management
- Clean and maintainable codebase

---

# Future Improvements

- Request validation using `zod` or `express-validator`
- Refresh token implementation
- Unit and integration tests
- Swagger API documentation
- Rate limiting and security enhancements

---

# Author

**Al Amin**  
Level-2 Backend Assignment

---