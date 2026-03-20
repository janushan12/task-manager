# TaskFlow — Task Manager App

![Angular](https://img.shields.io/badge/Angular-21-red?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)

A full stack Task Manager web application built with **Angular 21** (frontend) and **Spring Boot 3** (backend), using **MySQL 8** as the database. Supports full CRUD operations, JWT authentication, and Docker Compose deployment.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Running Locally (Without Docker)](#running-locally-without-docker)
- [Running With Docker Compose](#running-with-docker-compose)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Screenshots](#screenshots)
- [Evaluation Criteria](#evaluation-criteria)

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | Angular 21, Angular Material, SCSS              |
| Backend     | Spring Boot 3, Spring Data JPA, Spring Security |
| Database    | MySQL 8                                         |
| Auth        | JWT (JJWT 0.12.6)                               |
| DevOps      | Docker, Docker Compose, nginx                   |
| Build Tools | Maven (backend), Angular CLI (frontend)         |

---

## Features

### Core Features
- Create, view, edit, and delete tasks
- Filter tasks by status (To Do, In Progress, Done)
- Live task counts using Angular Signals
- Reactive Forms with validation (title required, max length)
- Error handling with snackbar notifications
- Responsive UI with sidebar navigation

### Bonus Features
- JWT-based authentication (register + login)
- Protected API routes with Spring Security
- Angular route guards and HTTP interceptors
- Full Docker Compose setup — one command starts everything

### Angular 21 Modern Features Used
- Standalone components (no AppModule)
- `signal()`, `computed()`, `effect()` for reactive state
- Built-in control flow (`@if`, `@for`, `@empty`)
- `inject()` function for dependency injection
- Zoneless change detection
- Functional route guards and HTTP interceptors
- `NonNullableFormBuilder` for type-safe forms

---

## Prerequisites

### For running locally (without Docker)
- Java 21+
- Node.js 22+
- Angular CLI: `npm install -g @angular/cli`
- MySQL 8
- Maven 3.9+

### For running with Docker
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose

---

## Running Locally (Without Docker)

### 1. Database Setup

Open MySQL and run:

```sql
CREATE DATABASE taskdb;
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'taskpass';
GRANT ALL PRIVILEGES ON taskdb.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend runs at: `http://localhost:4200`

> **Note:** When running locally, make sure `task.service.ts` and `auth.service.ts` use the full URL:
> ```typescript
> private apiUrl = 'http://localhost:8080/api/tasks';
> private apiUrl = 'http://localhost:8080/api/auth';
> ```

---

## Running With Docker Compose

### 1. Make sure Docker Desktop is running

Look for the whale icon in your taskbar — it should be steady (not animating).

### 2. Start the full stack

```bash
docker-compose up --build
```

First build takes 5–10 minutes to download images and compile everything.

### 3. Access the app

| Service  | URL                            |
|----------|--------------------------------|
| Frontend | http://localhost:4200          |
| API      | http://localhost:4200/api      |
| Database | localhost:3307 (host port)     |

### 4. Stop everything

```bash
docker-compose down
```

### 5. Stop and delete all data

```bash
docker-compose down -v
```

### Docker service ports

| Container          | Internal Port | Host Port |
|--------------------|---------------|-----------|
| taskflow-db        | 3306          | 3307      |
| taskflow-backend   | 8080          | 8080      |
| taskflow-frontend  | 80            | 4200      |

---

## API Endpoints

### Task Endpoints (require JWT)

| Method | URL                   | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/tasks            | Get all tasks      |
| GET    | /api/tasks/{id}       | Get task by ID     |
| POST   | /api/tasks            | Create a new task  |
| PUT    | /api/tasks/{id}       | Update a task      |
| DELETE | /api/tasks/{id}       | Delete a task      |

### Auth Endpoints (public)

| Method | URL                   | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/auth/register    | Register a new user      |
| POST   | /api/auth/login       | Login and receive JWT    |

### Sample Request Body (POST /api/tasks)

```json
{
  "title": "Set up the project",
  "description": "Initialize Spring Boot and Angular projects",
  "status": "TO_DO"
}
```

### Sample Login Request (POST /api/auth/login)

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Sample Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin"
}
```

---

## Authentication

This app uses **JWT (JSON Web Token)** based authentication.

### How it works

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Server validates credentials and returns a signed JWT token
3. Angular stores the token in `localStorage`
4. Every subsequent API request includes the token in the header:
   ```
   Authorization: Bearer <token>
   ```
5. Spring Security validates the token on every protected request

### Test Credentials

First register a user via the UI at `http://localhost:4200/login` or via API:

```bash
curl -X POST http://localhost:4200/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin\", \"password\": \"admin123\"}"
```

Then login with:
```
Username: admin
Password: admin123
```

### JWT Configuration

| Setting        | Value                    |
|----------------|--------------------------|
| Algorithm      | HMAC-SHA256              |
| Expiration     | 24 hours (86400000 ms)   |
| Header         | Authorization: Bearer    |

---

## Task Entity

```java
public class Task {
    private Long id;
    private String title;        // required, max 80 chars
    private String description;  // optional, max 300 chars
    private TaskStatus status;   // TO_DO | IN_PROGRESS | DONE
    private LocalDateTime createdAt;
}
```

### Task Status Values

| Value         | Display      |
|---------------|--------------|
| `TO_DO`       | To Do        |
| `IN_PROGRESS` | In Progress  |
| `DONE`        | Done         |

---

## Evaluation Criteria

| Area            | Implementation                                                                 |
|-----------------|--------------------------------------------------------------------------------|
| Angular         | Standalone components, Signals, @if/@for, Reactive Forms, route guards         |
| Spring Boot     | REST controllers, service layer, repository pattern, exception handling        |
| Database        | MySQL 8, JPA entities, Hibernate DDL auto-update                               |
| Code Quality    | Modular structure, DTOs, service layer separation, meaningful naming           |
| Bonus: JWT Auth | Spring Security + JJWT, filter chain, Angular interceptor, auth guard          |
| Bonus: Docker   | Multi-stage Dockerfiles, Docker Compose, nginx reverse proxy, healthchecks     |
| Git & README    | This README with full setup instructions, API docs, and credentials            |

---

## Environment Variables

### Backend (set in docker-compose.yml or application.properties)

| Variable                        | Default Value                                      | Description               |
|---------------------------------|----------------------------------------------------|---------------------------|
| SPRING_DATASOURCE_URL           | jdbc:mysql://localhost:3306/taskdb                 | MySQL connection URL      |
| SPRING_DATASOURCE_USERNAME      | db_user_name                                       | MySQL username            |
| SPRING_DATASOURCE_PASSWORD      | db_user_pass                                       | MySQL password            |
| APP_JWT_SECRET                  | taskflow-super-secret-key-...                      | JWT signing secret        |
| APP_JWT_EXPIRATION              | 86400000                                           | Token expiry in ms        |

---