# Cinema Ticket System

Cinema ticket reservation system developed for the Graphical User Interfaces course using ASP.NET Core, Entity Framework Core and React.

## Features

### User Management

* User registration and login
* JWT authentication
* User profile management
* Edit personal information:

  * First name
  * Last name
  * Phone number

### Cinema Screenings

* Fixed list of cinemas seeded into the database
* Create screenings (Admin only)
* Delete screenings (Admin only)
* Assign screenings to cinemas
* Manage screening dates and movie titles

### Seat Reservations

* Display room occupancy
* Reserve seats for a selected screening
* Cancel reservations
* Conflict handling for concurrent reservations

### Administration

* User management
* Screening management
* Role-based authorization

## Technologies

### Backend

* ASP.NET Core 8
* Entity Framework Core
* ASP.NET Identity
* JWT Authentication
* SQLite

### Frontend

* React
* React Router
* Axios
* Bootstrap

## Requirements

* .NET 8 SDK
* Node.js 18+
* npm

## Database

The application uses SQLite and Entity Framework Core.

The database is automatically created and seeded with:

* Administrator account
* Default cinemas
* User roles

## Default Administrator Account

Email:

[admin@cinema.com](mailto:admin@cinema.com)

Password:

Admin123!

## Running the Project

### Backend

Navigate to the backend folder:

```bash
cd backend
dotnet restore
dotnet run
```

The application will be available at:

```text
http://localhost:5168
```

### Frontend Development Mode

Navigate to the frontend folder:

```bash
cd frontend
npm install
npm start
```

React development server:

```text
http://localhost:3000
```

## Production Version (Single Server)

Build the React application:

```bash
cd frontend
npm run build
```

Copy the generated files from:

```text
frontend/build
```

to:

```text
backend/wwwroot
```

Run the ASP.NET application:

```bash
cd backend
dotnet run
```

The complete application will be available at:

```text
http://localhost:5168
```

Both the React frontend and the ASP.NET API are served by the same server.

## Concurrency Handling

### User Updates

User modifications use optimistic concurrency control through ASP.NET Identity.

### Seat Reservations

Seat reservation conflicts are prevented using a unique database constraint on:

```text
(ScreeningId, Row, Seat)
```

If multiple users attempt to reserve the same seat simultaneously, only one reservation succeeds.
