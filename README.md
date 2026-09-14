# Library Management API

A RESTful Library Management System built with **Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT, bcrypt, Docker, Docker Compose, Nginx, and PM2**.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL 18
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
* PM2
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
* PostgreSQL healthcheck
* API healthcheck
* Nginx reverse proxy
* Frontend served through Nginx
* PM2 process management
* Graceful server shutdown

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
│   ├── conf.d/
│   │   └── library.conf
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
├── ecosystem.config.js
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

## Search, Filtering and Sorting

Books and users support search, filtering, and sorting functionality.

## Authentication

Login using:

```text
POST /users/getToken
```

Protected endpoints require an access token:

```text
Authorization: Bearer <access_token>
```

Refresh tokens are handled through:

```text
POST /users/refreshToken
```

The application uses separate access and refresh tokens.

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

## Login Tracking

User login activity is tracked and stored in the `login_logs` table.

The login information is also used by the statistics API to determine the most active user based on login count.

## Logging

Morgan is used for HTTP request logging.

Logs are written to:

```text
logs/access.log
```

The logs directory is excluded from Git.

## Health Check

The API exposes a health endpoint:

```text
GET /health
```

The endpoint is used by Docker Compose to determine whether the API container is healthy.

The Docker healthcheck executes a request against:

```text
http://localhost:3000/health
```

The API container is considered healthy when the endpoint returns HTTP status `200`.

## Server Startup

The application starts by first authenticating the Sequelize database connection.

The startup flow is:

```text
Start Node.js
     ↓
Load environment variables
     ↓
Authenticate Sequelize
     ↓
Database connected
     ↓
Start Express server
     ↓
Server listening on port 3000
```

The server also sends a `ready` message when running under a process manager that supports ready signaling.

## Graceful Shutdown

The server handles:

```text
SIGINT
SIGTERM
```

During shutdown:

```text
Receive shutdown signal
        ↓
Stop accepting new requests
        ↓
Close HTTP server
        ↓
Close Sequelize connection
        ↓
Exit process
```

This ensures that the HTTP server and database connection are closed cleanly.

## PM2

PM2 is configured using:

```text
ecosystem.config.js
```

Current configuration:

```text
Application name: library-api
Script: ./server.js
Instances: 1
Execution mode: fork
Auto restart: enabled
Restart delay: 3000 ms
Maximum memory: 300 MB
Kill timeout: 5000 ms
Ready signal: enabled
Listen timeout: 5000 ms
```

The configuration can be started using:

```bash
pm2 start ecosystem.config.js
```

Check the process:

```bash
pm2 status
```

View logs:

```bash
pm2 logs library-api
```

Restart:

```bash
pm2 restart library-api
```

Stop:

```bash
pm2 stop library-api
```

Delete the process:

```bash
pm2 delete library-api
```

## Docker Architecture

The application uses Docker Compose to run three services:

```text
                    ┌──────────────────┐
                    │      Browser     │
                    └────────┬─────────┘
                             │
                       localhost:8090
                             │
                    ┌────────▼─────────┐
                    │      Nginx       │
                    │      :8090       │
                    └────────┬─────────┘
                             │
                    /api/*   │
                             ▼
                    ┌──────────────────┐
                    │    Node.js API   │
                    │      :3000       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    PostgreSQL    │
                    │      :5432       │
                    └──────────────────┘
```

The three Docker Compose services are:

```text
postgres
api
nginx
```

All three services communicate through the Docker network:

```text
library-network
```

## PostgreSQL Container

The database service uses:

```text
postgres:18
```

The database is configured using:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=library_management_db
```

Database storage is persisted using the Docker volume:

```text
library-db-data
```

The database uses a healthcheck:

```text
pg_isready -U postgres -d library_management_db
```

The API depends on PostgreSQL being healthy before it starts.

## API Container

The API is built using the project's `Dockerfile`.

The API receives environment variables from:

```text
.env
```

Docker Compose overrides the database host with:

```env
DB_HOST=postgres
```

The API therefore connects to the PostgreSQL container using the Docker Compose service name:

```text
postgres
```

rather than:

```text
localhost
```

The API runs internally on:

```text
3000
```

The API container also has a healthcheck using:

```text
GET http://localhost:3000/health
```

The Nginx service waits for the API service to become healthy before starting.

## Nginx

Nginx acts as both:

* Frontend web server
* Reverse proxy for the API

Nginx listens on:

```text
8090
```

The Docker port mapping is:

```text
8090:8090
```

### Frontend

The frontend is mounted into the Nginx container from:

```text
/home/user-spandan-sen/Documents/bookFrontend
```

and served from:

```text
/usr/share/nginx/html
```

The frontend is available at:

```text
http://localhost:8090/
```

### API Proxy

Requests beginning with:

```text
/api/
```

are forwarded to:

```text
http://api:3000/
```

For example:

```text
http://localhost:8090/api/books
```

is forwarded by Nginx to the Node.js API container.

The Nginx proxy also forwards request information using headers such as:

```text
Host
X-Real-IP
X-Forwarded-For
X-Forwarded-Proto
```

## Docker Service Dependencies

The startup order is controlled using Docker healthchecks.

```text
PostgreSQL
    ↓
PostgreSQL healthcheck
    ↓
API starts
    ↓
API healthcheck
    ↓
Nginx starts
```

This prevents the API from starting before PostgreSQL is ready and prevents Nginx from starting before the API is healthy.

## Running with Docker

### Prerequisites

Install:

* Docker
* Docker Compose

Verify the installation:

```bash
docker --version
docker compose version
```

### Clone the Repository

```bash
git clone <repository-url>
cd library-management-api
```

### Environment Configuration

Create the environment file:

```bash
cp .env.example .env
```

Update `.env` with the required database and JWT configuration.

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

### Start the Application

Build the images and start all services:

```bash
docker compose up -d --build
```

Check the services:

```bash
docker compose ps
```

The services should include:

```text
postgres
api
nginx
```

### Run Migrations

For a new database:

```bash
docker compose exec api npx sequelize-cli db:migrate
```

### Run Seeders

```bash
docker compose exec api npx sequelize-cli db:seed:all
```

### Open the Application

Frontend:

```text
http://localhost:8090
```

API through Nginx:

```text
http://localhost:8090/api/books
```

Health endpoint through Nginx:

```text
http://localhost:8090/api/health
```

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

Check service status:

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

Follow all logs:

```bash
docker compose logs -f
```

Restart a service:

```bash
docker compose restart api
```

Rebuild the API after code changes:

```bash
docker compose up -d --build api
```

## Testing

The API was tested using **Postman** and **curl**.

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
* PostgreSQL connectivity
* Nginx reverse proxy
* Frontend-to-API communication
* API healthcheck

## Development

For local development, environment variables can be loaded using `.env`.

The server can be started using the project's configured npm scripts.

For Docker-based development, rebuild the API image after changes when necessary:

```bash
docker compose up -d --build api
```

Check API logs:

```bash
docker compose logs -f api
```

Check the service status:

```bash
docker compose ps
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

When running through Docker Compose, the API database host is set to:

```text
postgres
```

This is the PostgreSQL service name inside the Docker network.

The actual `.env` file should not be committed to GitHub.

## Complete Architecture

```text
                              Browser
                                 │
                                 │ HTTP :8090
                                 ▼
                         ┌───────────────┐
                         │     Nginx     │
                         │     :8090     │
                         └───────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
               Frontend                   /api/*
                                              │
                                              ▼
                                      ┌───────────────┐
                                      │ Node/Express  │
                                      │      API      │
                                      │     :3000     │
                                      └───────┬───────┘
                                              │
                                              │ Sequelize
                                              ▼
                                      ┌───────────────┐
                                      │  PostgreSQL   │
                                      │     :5432     │
                                      └───────────────┘

                         Docker Network:
                         library-network
```

## Request Flow

A frontend API request follows this flow:

```text
Browser
   │
   │ GET /api/books
   ▼
Nginx :8090
   │
   │ proxy_pass
   ▼
Node.js API :3000
   │
   ▼
Express Router
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Sequelize
   │
   ▼
PostgreSQL
   │
   ▼
JSON Response
   │
   ▼
Nginx
   │
   ▼
Browser
```

## Security

The application uses several security-related mechanisms:

* JWT authentication
* Access and refresh tokens
* Password hashing with bcrypt
* Role-based authorization
* Token revocation
* Joi/request validation
* Helmet security headers
* CORS configuration
* Environment variables for secrets
* Nginx reverse proxy

Sensitive configuration such as database passwords and JWT secrets is kept outside the source code using environment variables.

## Author

**Spandan Sen**
