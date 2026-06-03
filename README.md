Cinema Ticket System - Tasks 3 & 4

Graphical User Interfaces project developed with:

- ASP.NET Core Web API
- React (Create React App)
- Entity Framework Core
- SQLite
- Bootstrap

==================================================
FEATURES
==================================================

Authentication
--------------
- User registration
- Login with JWT authentication
- Role-based authorization (Admin/User)

Users Management
----------------
- Edit user profile
- Admin can manage users
- Optimistic concurrency handling using ConcurrencyStamp

Screenings
----------
- List screenings
- Admin can create screenings
- Admin can delete screenings

Reservations
------------
- Display room occupancy for a selected screening
- View available and occupied seats
- Reserve a seat
- Cancel a reservation
- Users can only cancel their own reservations
- Administrators can manage all reservations

Concurrent Reservation Handling
-------------------------------
The application prevents multiple users from reserving
the same seat simultaneously.

A unique database constraint is applied on:

(ScreeningId, Row, Seat)

If two users attempt to reserve the same seat at the
same time:

- the first reservation succeeds
- the second reservation receives 409 Conflict

This guarantees seat consistency and prevents
duplicate reservations.

Production Deployment
---------------------
The application supports deployment using a single
ASP.NET Core server.

The React frontend is built using:

npm run build

and served by ASP.NET Core through static files.

==================================================
TECHNOLOGIES
==================================================

Backend
-------
- ASP.NET Core
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication
- SQLite

Frontend
--------
- React
- React Router
- Axios
- Bootstrap
- Create React App

==================================================
RUN BACKEND
==================================================

cd backend
dotnet run --launch-profile http

Backend runs on:

http://localhost:5168

==================================================
RUN FRONTEND
==================================================

cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000

==================================================
PRODUCTION BUILD
==================================================

Create the React production build:

cd frontend
npm run build

Copy the build into the backend static files directory:

cp -r build ../backend/wwwroot

Run the backend:

cd ../backend
dotnet run

The entire application will be available from a
single ASP.NET Core server.

==================================================
USER CONCURRENCY HANDLING
==================================================

The application uses optimistic concurrency control
with ConcurrencyStamp.

When a user is updated or deleted:

- frontend sends the current ConcurrencyStamp
- backend compares it with the database value
- if values differ, backend returns 409 Conflict

This prevents overwriting changes made by another
user.

==================================================
DEMO ADMIN ACCOUNT
==================================================

Email: admin@cinema.com
Password: Admin123!