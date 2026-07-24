# Meeting Room Booking System

## Project Overview

This project is a Next.js + TypeScript frontend for a meeting room booking system. It provides a dashboard experience for managing users and bookings through a deployed API backend.

The current frontend is focused on the UI flow for:
- Dashboard overview
- User management
- Booking management
- Role-based permissions

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Material UI
- Ant Design
- Axios
- Prisma ORM

## Run Frontend Locally

The frontend can be run locally without setting up a local database because it uses the deployed API.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the app in your browser:
   - http://localhost:3000

## Deployed URL

- Frontend: https://meeting-room-booking-sys-ten.vercel.app

## API Endpoints

The frontend connects to the deployed backend at:
- https://meeting-room-booking-sys-ten.vercel.app

Available endpoints:
- GET /api/users
- POST /api/users
- PATCH /api/users/:id
- DELETE /api/users/:id
- GET /api/bookings
- POST /api/bookings
- DELETE /api/bookings/:id
- GET /api/rooms
- GET /api/rooms/:id
- GET /api/test-db

## Role Permission Explanation

Role-based permissions are handled through the x-user-role header.

Supported roles:
- ADMIN: can view and manage all users and bookings
- OWNER: can manage bookings, but user management is restricted to the backend rules
- USER: can view bookings and delete only their own bookings

The frontend uses the selected role from localStorage to simulate these permissions for testing purposes.

## Database Note

The application uses Prisma with a remote Prisma Postgres database hosted externally. A local database setup is not required to run the frontend, because the deployed API already serves the data.

## Test User Examples

Sample user accounts and roles that can be used for testing:
- Admin: user1@example.com / role ADMIN
- User: user2@example.com / role USER
- User: may@example.com / role USER

These are examples of the seeded data currently exposed through the deployed API.
