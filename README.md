# DevPulse API

## Live URL

https://l2-b7-a2express-1dc0tndu0-touhidcse.vercel.app

## Features

### Authentication Module

* User Registration
* User Login
* JWT-based Authentication
* Password Hashing using bcryptjs
* Role-based Authorization (Contributor & Maintainer)

### Issues Module

* Create Issue
* Get All Issues
* Get Single Issue
* Update Issue
* Delete Issue

---

## Tech Stack

| Technology   | Version / Description                |
| ------------ | ------------------------------------ |
| Node.js      | v24.15.0                             |
| TypeScript   | v6.0.3                               |
| Express.js   | v5.0.6 (Modular Router Architecture) |
| PostgreSQL   | Database                             |
| Raw SQL      | Direct `pool.query()`                |
| bcryptjs     | Password Hashing                     |
| jsonwebtoken | JWT Generation & Verification        |
| dotenv       | Environment Variable Management      |
| cors         | Cross-Origin Resource Sharing        |

---

## Setup Instructions

### 1. Initialize Project

```bash
npm init -y
```

### 2. Install TypeScript

```bash
npm i -D typescript
```

### 3. Create TypeScript Configuration

```bash
npx tsc --init
```

### 4. Install Express

```bash
npm install express
```

### 5. Install Express Type Definitions

```bash
npm i --save-dev @types/express
```

### 6. Install TSX

```bash
npm i -D tsx
```

### 7. Install PostgreSQL Driver

```bash
npm install pg
```

### 8. Install PostgreSQL Type Definitions

```bash
npm i --save-dev @types/pg
```

### 9. Configure Neon Database

```bash
npx neonctl@latest init
```

### 10. Create Environment Variables

Create a `.env` file and add:

```env
CONNECTIONSTRING=your_database_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### 11. Install dotenv

```bash
npm i dotenv
```

Create a `config` folder inside `src` and configure environment variables in `src/config/index.ts`.

### 12. Install bcryptjs

```bash
npm i bcryptjs
```

### 13. Install jsonwebtoken

```bash
npm i jsonwebtoken
```

### 14. Install cors

```bash
npm i cors
```

### 15. Install cors Type Definitions

```bash
npm i --save-dev @types/cors
```

### 16. Run the Application

```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | `/api/auth/signup` |
| POST   | `/api/auth/login`  |

### Issues

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/issues`             |
| GET    | `/api/issues?sort=newest` |
| GET    | `/api/issues/:id`         |
| PATCH  | `/api/issues/:id`         |
| DELETE | `/api/issues/:id`         |

---

# Database Schema Summary

## Table: users

This table stores all system users including contributors and maintainers.

| Field      | Description                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| id         | Auto-incrementing unique identifier for each account                                              |
| name       | Full display name of the team member, required                                                    |
| email      | Unique login email address, required                                                              |
| password   | Encrypted password stored securely, never returned in API responses                               |
| role       | User role for access control. Default: `contributor`. Allowed values: `contributor`, `maintainer` |
| created_at | Timestamp when account was created (auto-generated)                                               |
| updated_at | Timestamp when account was last updated                                                           |

---

## Table: issues

This table stores bug reports and feature requests submitted by users.

| Field       | Description                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------ |
| id          | Auto-incrementing unique identifier for each issue                                               |
| title       | Short headline of the issue, required, maximum 150 characters                                    |
| description | Detailed explanation of the issue, required, minimum 20 characters                               |
| type        | Category of issue. Allowed values: `bug`, `feature_request`                                      |
| status      | Current workflow state. Default: `open`. Allowed values: `open`, `in_progress`, `resolved`       |
| reporter_id | ID of the user who created the issue (validated in application logic, no foreign key constraint) |
| created_at  | Timestamp when the issue was created (auto-generated)                                            |
| updated_at  | Timestamp when the issue was last updated                                                        |

---

## Project Structure

```txt
src
├── config
├── db
├── middleware
├── modules
│   ├── auth
│   ├── user
│   └── issue
├── types
└── utility
```

---

## Author

**Mohammad Touhidul Alam**
