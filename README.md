# Library Management API

A RESTful Library Management System built with **Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT, bcrypt, Docker, Docker Compose, and Nginx**.

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
* Docker
* Docker Compose
* Nginx
* Postman

## Features

* Books CRUD
* Book copies management
* Users CRUD
* Book lending/records management
* Payments
* Book search, filtering, and sorting
* User search, filtering, and sorting
* JWT authentication
* Access and refresh tokens
* Role-based authorization
* Logout with token revocation
* Login tracking
* Statistics API
* Request logging
* Sequelize migrations and seeders
* PostgreSQL data persistence
* Dockerized API and database
* Nginx reverse proxy
* Simple frontend served through Nginx

## User Roles

The system supports three roles:

* **Librarian**
* **Student**
* **Faculty**

Librarians have administrative CRUD access, while Student and Faculty access is restricted according to the implemented authorization rules.

## Project Structure

```text
library-management-api/
├── config/
├── controllers/
├── middleware/
├── migrations/
├── models/
├── nginx/
│   └── default.conf
├── routes/
├── seeders/
├── services/
├── utils/
├── validators/
├── logs/
├── .env
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── compose.yaml
├── app.js
├── server.js
├── package.json
└── README.md
```

## Database

PostgreSQL is used as the database and Sequelize is used as the ORM.

Main tables include:

```text
roles
users
books
book_copies
records
payments
revoked_tokens
login_logs
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

Each book can have multiple physical copies, and each copy has its own unique ID.

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
```

### Statistics

```text
GET /statistics
```

The statistics API provides information such as:

* Highest lent book
* Most active user based on login count
* Oldest book
* Newest book
* Most available book
* Total users
* Total books
* Total currently lent books

## Search, Filter and Sort

Books and users support search, filtering, and sorting.

### Authentication

Login using:

```text
POST /users/getToken
```

Protected endpoints require:

```text
Authorization: Bearer <access_token>
```

Refresh tokens are handled through:

```text
POST /users/refreshToken
```

## Authorization

Role-based authorization is implemented using middleware.

```text
Request
   ↓
authenticate
   ↓
authorize("Librarian")
   ↓
Controller
   ↓
Database
```

The `authenticate` middleware verifies the JWT access token.

The `authorize` middleware checks whether the authenticated user's role is allowed to access the endpoint.

## Logout and Token Revocation

The application supports token revocation.

When a token is revoked, its JTI, token type, and expiration time are stored in the `revoked_tokens` table.

This allows the application to reject a revoked token even if its original expiration time has not been reached.

## Logging

Morgan is used for HTTP request logging.

Logs are written to:

```text
logs/access.log
```

The logs directory is excluded from Git.

## Docker

The application is containerized using Docker.

The Docker setup contains three services:

```text
                 ┌──────────────┐
                 │    Nginx     │
                 │    :80       │
                 └──────┬───────┘
                        │
                  /api requests
                        │
                 ┌──────▼───────┐
                 │     API      │
                 │   Node.js    │
                 │    :3000     │
                 └──────┬───────┘
                        │
                        │
                 ┌──────▼───────┐
                 │  PostgreSQL  │
                 │    :5432     │
                 └──────────────┘
```

Docker Compose defines and runs these services together in a shared Docker network.

### Services

#### PostgreSQL

Uses:

```text
postgres:18
```

Database data is persisted using the Docker volume:

```text
library-db-data
```

A PostgreSQL healthcheck is used so that the API waits for the database to become healthy before starting.

#### API

The Node.js API is built using the project's `Dockerfile`.

The API communicates with PostgreSQL using the Docker service name:

```text
postgres
```

rather than `localhost`.

#### Nginx

Nginx acts as the reverse proxy and frontend server.

It:

* Serves the frontend at `/`
* Forwards `/api/*` requests to the API container
* Provides a single entry point through port `80`

For example:

```text
http://localhost/
```

serves the frontend.

```text
http://localhost/api/books
```

is forwarded by Nginx to the API.

This type of Node.js + Nginx multi-container architecture is also demonstrated in Docker's official examples.

## Running with Docker

### Prerequisites

Install Docker and Docker Compose.

Verify:

```bash
docker --version
docker compose version
```

### Setup

Clone the repository:

```bash
git clone <repository-url>
cd library-management-api
```

Create the environment file:

```bash
cp .env.example .env
```

Update `.env` with the required database and JWT configuration.

### Start the application

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

The application should contain:

```text
postgres
api
nginx
```

### Run migrations

For a new database:

```bash
docker compose exec api npx sequelize-cli db:migrate
```

### Run seeders

```bash
docker compose exec api npx sequelize-cli db:seed:all
```

### Open the application

Frontend:

```text
http://localhost
```

API through Nginx:

```text
http://localhost/api/books
```

The Docker workflow makes the application reproducible across environments by defining the application services and their configuration in Docker files and Compose.

## Useful Docker Commands

Start the application:

```bash
docker compose up -d
```

Build and start:

```bash
docker compose up -d --build
```

Stop containers:

```bash
docker compose down
```

View containers:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs api
```

View Nginx logs:

```bash
docker compose logs nginx
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

Follow logs:

```bash
docker compose logs -f
```

## Testing

The API was tested using Postman and curl.

Tested areas include:

* User CRUD
* Book CRUD
* Book copy operations
* Lending/record operations
* Payments
* Search, filtering, and sorting
* Login
* Access token authentication
* Refresh token
* Logout and token revocation
* Role-based authorization
* Statistics
* Validation
* Error handling
* Docker container communication
* Nginx reverse proxy
* Frontend-to-API communication

## Development

For code changes to the Dockerized application, rebuild the API image when required:

```bash
docker compose up -d --build
```

Check service status:

```bash
docker compose ps
```

Check API logs:

```bash
docker compose logs api
```

## Environment Variables

The project uses environment variables for configuration and secrets.

Example:

```env
PORT=3000

DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=library_management_db
DB_HOST=postgres
DB_PORT=5432

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Do not commit the actual `.env` file or production secrets to GitHub.

## Architecture

```text
                         Browser
                            │
                            │ HTTP :80
                            ▼
                     ┌─────────────┐
                     │    Nginx    │
                     │   :80       │
                     └──────┬──────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
          Frontend                  /api/*
                                      │
                                      ▼
                               ┌─────────────┐
                               │ Node/Express │
                               │    API       │
                               │    :3000     │
                               └──────┬──────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │ PostgreSQL  │
                               │    :5432     │
                               └─────────────┘
```

## Author

**Spandan Sen**
