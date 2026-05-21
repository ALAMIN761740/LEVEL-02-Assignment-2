# Issue Tracker API

A secure and scalable Issue Tracker REST API built with TypeScript, Express.js, PostgreSQL, and JWT authentication. This project matches the Level-2 assignment requirements: modular structure, raw SQL queries via `pg` pool, role-based permissions, and Vercel deployment support.

---

**Live URL:**

https://assignment2-alpha-six.vercel.app

---

**GitHub Repository:**

https://github.com/ALAMIN761740/LEVEL-02-Assignment-2

---

**Features**
- **Authentication:** Signup & Login with bcrypt-hashed passwords and JWTs.
- **Role-based permissions:** `contributor` and `maintainer` roles enforced in business logic.
- **Issue management:** Create, read, update, delete issues (raw SQL via `pool.query`).
- **Global error handling, utilities, and TypeScript types.**
- **Vercel-ready:** App exports the Express `app` for serverless deployment.

---

**Tech Stack**
- Node.js, TypeScript
- Express.js
- PostgreSQL (`pg` driver, raw SQL only)
- JWT (`jsonwebtoken`), bcrypt
- Vercel for deployment

---

**Quick Start**

1. Clone repository

```bash
git clone https://github.com/ALAMIN761740/LEVEL-02-Assignment-2.git
cd LEVEL-02-Assignment-2
```

2. Install

```bash
npm install
```

3. Environment

Create a `.env` in the project root with at least:

```env
PORT=5000

# Either DATABASE_URL or CONNECTION_STRING is accepted by the app
CONNECTION_STRING=postgresql://user:pass@host:port/dbname

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

4. Run (development)

```bash
npm run dev
```

5. Build / Start (production)

```bash
npm run build
npm start
```

---

**Environment / Deployment Notes**
- The app reads `DATABASE_URL` or `CONNECTION_STRING` (fallback) for PostgreSQL.
- On Vercel: add environment variables in Project Settings — Vercel does not automatically read local `.env` files for production.
- Required env vars: `DATABASE_URL` (or `CONNECTION_STRING`), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT` (optional).

---

**API Endpoints (summary)**

**Auth**
- POST `/api/auth/signup` — Register user
- POST `/api/auth/login` — Login, returns `{ token, user }`

**Issues**
- POST `/api/issues` — Create issue (authenticated)
- GET `/api/issues` — Get all issues (supports `?sort=newest|oldest`, `?type=`, `?status=`)
- GET `/api/issues/:id` — Get single issue
- PATCH `/api/issues/:id` — Update issue (authenticated; role rules applied)
- DELETE `/api/issues/:id` — Delete issue (authenticated; maintainer only)

All protected routes require the `Authorization` header with the raw JWT token (the middleware expects `req.headers.authorization` to contain the token string).

Example create issue request body:

```json
{
	"title": "Bug: Login button fails",
	"description": "When clicking the login button it returns 500 under load...",
	"type": "bug"
}
```

Example login response (200):

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"token": "<jwt>",
		"user": { "id": 1, "name": "...", "role": "contributor" }
	}
}
```

---

**Database Schema (summary)**
- `users` table (created by `src/db/init.ts`):
	- `id` SERIAL PRIMARY KEY
	- `name` VARCHAR(100) NOT NULL
	- `email` VARCHAR(100) UNIQUE NOT NULL
	- `password` VARCHAR(255) NOT NULL
	- `role` VARCHAR(20) DEFAULT 'contributor'
	- `created_at`, `updated_at` TIMESTAMP
- `issues` table (created by `src/db/init.ts`):
	- `id` SERIAL PRIMARY KEY
	- `title` VARCHAR(150) NOT NULL
	- `description` TEXT NOT NULL
	- `type` VARCHAR(30) NOT NULL
	- `status` VARCHAR(30) DEFAULT 'open'
	- `reporter_id` INT NOT NULL
	- `created_at`, `updated_at` TIMESTAMP

Design notes: queries are implemented using raw SQL via `pool.query` and reporter details are fetched via a secondary query (no joins required by the assignment).

---

**Project Structure**

See the main app and routes:
- [src/app.ts](src/app.ts#L1-L200)
- [src/server.ts](src/server.ts#L1-L200)
- [src/config/index.ts](src/config/index.ts#L1-L40)
- [src/db/init.ts](src/db/init.ts#L1-L200)
- [src/modules/auth](src/modules/auth/auth.route.ts#L1-L200)
- [src/modules/issue](src/modules/issue/issue.route.ts#L1-L200)

---

**Assignment Checklist**
- [x] Modular architecture with `modules/`, `utils/`, `middleware/`, `config/`
- [x] Raw SQL only via `pg` pool
- [x] JWT authentication and role checks implemented
- [x] Passwords hashed with `bcrypt`
- [x] DB init script creates required tables
- [x] Endpoints match the assignment spec (paths and methods)
- [x] Vercel deployment supported (exports `app` for serverless)

---

**Next Steps / Recommendations**
- Ensure Vercel environment variables are set (`DATABASE_URL` or `CONNECTION_STRING`, `JWT_SECRET`, `JWT_REFRESH_SECRET`).
- Add input validation (e.g., via `express-validator`) for stronger request validation.
- Add tests for auth and issue flows.

---

**Author**

Al Amin — Level 2 Backend Assignment

---

If you want, I can also:
- add example `curl` or Postman collection for the main flows,
- add `CONTRIBUTING.md` or expand the README with more examples.

