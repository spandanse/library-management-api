# Library Management API

A RESTful Library Management System API built with **Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT, and bcrypt**.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* JWT
* bcrypt
* Joi
* dotenv
* CORS
* Helmet
* Morgan
* Postman

## Features

* Books CRUD
* Book copies management
* Users CRUD
* Records (book lending) CRUD
* Payments CRUD
* Book search, filter, and sort
* User search, filter, and sort
* JWT authentication
* Access and refresh tokens
* Role-based authorization
* Login tracking
* Statistics API
* PostgreSQL database with Sequelize migrations and seeders
* Request logging to `logs/access.log`

## User Roles

The system supports three roles:

* Librarian
* Student
* Faculty

Librarians have full CRUD access. Students and Faculty have restricted read access according to the implemented authorization rules.

## Project Structure

```text
library-management-api/
├── config/
├── controllers/
├── middleware/
├── migrations/
├── models/
├── routes/
├── seeders/
├── services/
├── utils/
├── validators/
├── logs/
├── .env
├── .env.example
├── .gitignore
├── app.js
├── server.js
├── package.json
└── README.md
```

## Database

PostgreSQL is used as the database and Sequelize is used as the ORM.

Main tables:

```text
roles
users
books
book_copies
records
payments
revoked_tokens
```

### Relationships

```text
roles
  │
  └──< users
          │
          └──< records >── book_copies >── books
                    │
                    └──< payments
```

Each book can have multiple physical copies, and each copy has a unique ID.

## Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd library-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000

DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=library_management_db
DB_HOST=localhost
DB_PORT=5432

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 4. Create the database

Create the PostgreSQL database:

```text
library_management_db
```

### 5. Run migrations

```bash
npx sequelize-cli db:migrate
```

### 6. Run seeders

```bash
npx sequelize-cli db:seed:all
```

### 7. Start the server

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

## API Endpoints

### Users

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

### Authentication

```text
POST /users/getToken
POST /users/refreshToken
```

### Books

```text
GET    /books
GET    /books/:id
POST   /books
PUT    /books/:id
DELETE /books/:id
```

### Book Copies

```text
GET    /book-copies
GET    /book-copies/:id
POST   /book-copies
PUT    /book-copies/:id
DELETE /book-copies/:id
```

### Records

```text
GET    /records
GET    /records/:id
POST   /records
PUT    /records/:id
DELETE /records/:id
```

### Payments

```text
GET    /payments
GET    /payments/:id
POST   /payments
PUT    /payments/:id
DELETE /payments/:id
```

### Statistics

```text
GET /statistics
```

The statistics API provides:

* Highest lent book
* Most active user based on login count
* Oldest book
* Newest book
* Most available book
* Total users
* Total books
* Total currently lent books

## Search, Filter and Sort

Users and books support search, filtering, and sorting through the request body.

### Users

```json
{
  "search": {
    "name": "John"
  },
  "filter": {
    "category": "Student"
  },
  "sort": {
    "name": "asc",
    "registration_date": "desc"
  }
}
```

### Books

```json
{
  "search": {
    "name": "Database"
  },
  "filter": {
    "subject": "Computer Science"
  },
  "sort": {
    "name": "asc"
  }
}
```

Only allowed fields are used for sorting.

## Authentication

Login using:

```text
POST /users/getToken
```

Example:

```json
{
  "username": "admin",
  "password": "password"
}
```

The API returns an access token and refresh token.

Protected endpoints require:

```text
Authorization: Bearer <access_token>
```

Refresh tokens can be used through:

```text
POST /users/refreshToken
```

## Authorization

Role-based authorization is implemented using middleware.

```text
authenticate
      ↓
authorize("Librarian")
      ↓
protected endpoint
```

Librarians can perform CRUD operations, while Student and Faculty access is restricted according to the implemented rules.

## Logout and Token Revocation

Access and refresh tokens can be revoked during logout.

Revoked token JTIs are stored in the `revoked_tokens` table along with:

* Token type
* Expiration time

This prevents a logged-out access token from being reused before its normal expiry.

## Logging

Morgan is used for HTTP request logging.

Logs are stored in:

```text
logs/access.log
```

The `logs/` directory is excluded from Git.

## Database Schema

Database schema designed using:

**Schema Design:** `<YOUR_SCHEMA_DESIGN_LINK>`

## Testing

The API was tested using Postman.

Tested areas include:

* User CRUD
* Book CRUD
* Book copy operations
* Record/lending operations
* Payment CRUD
* Search, filter, and sort
* Login
* Access token authentication
* Refresh token
* Logout and token revocation
* Role-based authorization
* Statistics
* Validation and error handling

## Git

The project is version controlled using Git with multiple meaningful commits throughout development.

## Repository

**GitHub:** `<YOUR_GITHUB_REPOSITORY_URL>`
