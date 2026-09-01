# Cinema Ticket Reservation System

A full-stack cinema ticket reservation system built with **React** and **ASP.NET Core Web API**.

The project includes user authentication, role-based authorization, profile management, screening management, seat reservations, concurrency control and single-server deployment.

## Overview

The application allows users to:

- Register and log in
- Manage their profile
- Browse cinema screenings
- View seat availability
- Reserve available seats
- Cancel their own reservations

Administrators can additionally:

- Manage users
- Create and delete screenings
- Manage reservations across the system

This repository contains the evolved version of the project. The system was initially implemented with **ASP.NET Core MVC** and was later redesigned using a **React frontend** and an **ASP.NET Core Web API backend**.

The original MVC implementation is available here:

[Cinema Ticket Reservation System — ASP.NET Core MVC](https://github.com/alvaarobuendia/cinema-ticket-system-mvc)

## Features

### Authentication and Authorization

- User registration
- Login with JWT authentication
- ASP.NET Core Identity
- Role-based authorization with `Admin` and `User` roles
- Protected API endpoints
- Secure configuration through environment variables

### User Management

- User profile editing
- Administrative user management
- Optimistic concurrency control using `ConcurrencyStamp`
- Detection of conflicting user updates
- HTTP `409 Conflict` responses when concurrent updates are detected

### Screenings

- List available screenings
- Create screenings as an administrator
- Delete screenings as an administrator
- Associate screenings with cinemas

### Reservations

- Display room occupancy for a selected screening
- Distinguish available and occupied seats
- Reserve a seat
- Cancel a reservation
- Restrict users to cancelling their own reservations
- Allow administrators to manage reservations

### Concurrent Reservation Handling

The application prevents multiple users from reserving the same seat simultaneously.

A unique database constraint is applied to:

```text
(ScreeningId, Row, Seat)
```

If two users attempt to reserve the same seat at the same time:

1. The first reservation succeeds.
2. The second request receives an HTTP `409 Conflict`.

This guarantees seat consistency and prevents duplicate reservations.

## Architecture

The project is divided into two main applications:

```text
React Frontend
      |
      | HTTP / REST
      v
ASP.NET Core Web API
      |
      v
Entity Framework Core
      |
      v
SQLite
```

### Backend

The backend is responsible for:

- REST API endpoints
- Authentication and authorization
- JWT generation and validation
- Business logic
- User and role management
- Reservation concurrency handling
- Database access
- Database migrations
- Initial data seeding

### Frontend

The React frontend is responsible for:

- Application routing
- Authentication state
- User interface
- API communication
- Screening visualization
- Seat selection
- User and reservation management

## Project Structure

```text
backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── CinemasController.cs
│   ├── ReservationsController.cs
│   ├── ScreeningsController.cs
│   └── UsersController.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   └── DesignTimeDbContextFactory.cs
├── DTOs/
│   ├── Auth/
│   ├── Reservations/
│   ├── Screenings/
│   └── Users/
├── Migrations/
├── Models/
│   ├── ApplicationUser.cs
│   ├── Cinema.cs
│   ├── Reservation.cs
│   └── Screening.cs
├── Seed/
│   └── DatabaseSeeder.cs
├── Services/
│   └── JwtService.cs
├── Settings/
│   └── JwtSettings.cs
├── Program.cs
└── CinemaTicketSystem.Api.csproj

frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   └── index.js
├── package.json
└── package-lock.json

CinemaTicketSystem.sln
README.md
```

## Technologies

### Backend

- C#
- .NET 8
- ASP.NET Core Web API
- ASP.NET Core Identity
- Entity Framework Core
- JWT authentication
- SQLite
- Swagger / OpenAPI

### Frontend

- React
- React Router
- Axios
- Bootstrap
- JavaScript
- HTML
- CSS

### Concepts

- REST API design
- Authentication and authorization
- Role-based access control
- Optimistic concurrency control
- Database constraints
- Entity Framework migrations
- Full-stack web development
- Single-server deployment

## Requirements

### Backend

- .NET 8 SDK

### Frontend

- Node.js 20 or later recommended
- npm

## Configuration

Sensitive configuration is not stored directly in the repository.

Before starting the backend, define the required environment variables.

### Linux / macOS

```bash
export JwtSettings__SecretKey="replace-with-a-long-development-secret"
export AdminUser__Password="replace-with-a-demo-admin-password"
```

### Optional Admin Account

The seed process can create an administrator account when an admin password is supplied.

Default email:

```text
admin@cinema.com
```

The password must be provided through:

```text
AdminUser__Password
```

If no password is configured, the demo administrator is not created.

## Database

The application uses SQLite with Entity Framework Core.

Database migrations are automatically applied when the backend starts.

The SQLite database file is excluded from version control.

The repository contains the Entity Framework migrations required to recreate the database from scratch.

## Run in Development

### 1. Install frontend dependencies

From the repository root:

```bash
cd frontend
npm install
```

### 2. Start the backend

Return to the repository root and run:

```bash
JwtSettings__SecretKey="replace-with-a-long-development-secret" \
AdminUser__Password="replace-with-a-demo-admin-password" \
dotnet run --project backend/CinemaTicketSystem.Api.csproj
```

The API runs by default at:

```text
http://localhost:5168
```

### 3. Start the React frontend

In another terminal:

```bash
cd frontend
npm start
```

The React development server runs at:

```text
http://localhost:3000
```

## Production Build

The application also supports a single-server deployment in which ASP.NET Core serves both the API and the compiled React frontend.

### 1. Build the React application

```bash
cd frontend
npm install
npm run build
```

### 2. Copy the production build to ASP.NET Core

From the repository root:

```bash
rm -rf backend/wwwroot
mkdir -p backend/wwwroot
cp -r frontend/build/* backend/wwwroot/
```

### 3. Run the backend

```bash
JwtSettings__SecretKey="replace-with-a-long-development-secret" \
AdminUser__Password="replace-with-a-demo-admin-password" \
dotnet run --project backend/CinemaTicketSystem.Api.csproj
```

The complete application is then available from:

```text
http://localhost:5168
```

## API Documentation

When the application runs in the Development environment, Swagger is available for exploring and testing the API.

Swagger is configured with JWT Bearer authentication support.

## Concurrency Control

### User Updates

User updates use optimistic concurrency control through ASP.NET Identity's `ConcurrencyStamp`.

The flow is:

1. The frontend retrieves the current user data and concurrency stamp.
2. The user submits an update.
3. The backend compares the supplied concurrency stamp with the current value.
4. If the values differ, the request returns `409 Conflict`.
5. Otherwise, the update is applied.

This prevents one user or administrator from silently overwriting a more recent change.

### Seat Reservations

Reservation concurrency is enforced at the database level using a unique constraint on:

```text
ScreeningId + Row + Seat
```

This ensures that the same seat cannot be assigned to multiple users for the same screening.

## Security Considerations

- JWT signing secrets are provided through configuration rather than committed to source control.
- Demo administrator passwords are provided through environment variables.
- Password handling is delegated to ASP.NET Core Identity.
- API endpoints use role-based authorization.
- Database files and generated build artifacts are excluded from version control.

## Project Evolution

This repository represents the second and more advanced implementation of the Cinema Ticket Reservation System.

The project initially used:

- ASP.NET Core MVC
- Razor views
- ASP.NET Core Identity
- Entity Framework Core
- SQLite

It was then redesigned using:

- React
- ASP.NET Core Web API
- JWT authentication
- REST API architecture
- Single-server deployment

The original MVC version is available here:

[Cinema Ticket Reservation System — ASP.NET Core MVC](https://github.com/alvaarobuendia/cinema-ticket-system-mvc)

## Academic Context

Developed as part of the **Graphical User Interfaces** course at **Warsaw University of Technology (WUT)** during the 2025–2026 Erasmus+ academic year.

## Author

**Álvaro Buendía Senise**

- GitHub: [alvarobuendia](https://github.com/alvaarobuendia)
- LinkedIn: [Álvaro Buendía Senise](https://www.linkedin.com/in/%C3%A1lvaro-buend%C3%ADa-senise-777629289/)
