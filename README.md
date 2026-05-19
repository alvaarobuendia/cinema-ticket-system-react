# Cinema Ticket System - Task 3

Graphical User Interfaces project developed with:

- ASP.NET Core Web API
- React (Create React App)
- Entity Framework Core
- SQLite
- Bootstrap

## Features

### Authentication
- User registration
- Login with JWT authentication
- Role-based authorization (Admin/User)

### Users Management
- Edit user profile
- Admin can manage users
- Optimistic concurrency handling using `ConcurrencyStamp`

### Screenings
- List screenings
- Admin can create screenings
- Admin can delete screenings

## Technologies

### Backend
- ASP.NET Core
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication
- SQLite

### Frontend
- React
- React Router
- Axios
- Bootstrap
- Create React App

---

# Run Backend

```bash
cd backend
dotnet run --launch-profile http
```

Backend runs on:

```txt
http://localhost:5168
```

---

# Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```txt
http://localhost:3000
```

---

# Concurrency Handling

The application uses optimistic concurrency control with `ConcurrencyStamp`.

When a user is updated or deleted:
- frontend sends the current `ConcurrencyStamp`
- backend compares it with database value
- if values differ, backend returns:

```txt
409 Conflict
```

This prevents overwriting changes made by another user.

---

# Demo Admin Account

```txt
Email: admin@cinema.com
Password: Admin123!
```
