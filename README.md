# Meeting Room Booking System

## Project Overview

A full-stack meeting room booking system for a single meeting room with role-based access control. Built with Next.js, TypeScript, and Prisma.

**Live Demo:** https://meeting-room-booking-sys-ten.vercel.app

---

## Features

### Core Features
- Single Meeting Room - Only one booking allowed per time slot
- Booking Rules - All 5 rules implemented (startTime < endTime, no overlaps, back-to-back allowed, etc.)
- Role-Based Access - Admin, Owner, and User roles with distinct permissions
- User Management - Create, delete, and change user roles (Admin only)
- Cascade Delete - Deleting a user automatically deletes all their bookings
- Booking Summary - View bookings grouped by user (Admin/Owner only)
- User-Friendly Errors - Clear, meaningful error messages

### Booking Rules Implemented
1. startTime must be before endTime
2. Bookings must not overlap (single room)
3. Overlap detection handles all cases:
   - Identical ranges
   - Partial overlaps
   - One range fully inside another
   - Back-to-back bookings (allowed)
4. Consistent time handling (UTC/ISO 8601)
5. Clear error responses

---

## Role Permissions

| Feature | Admin | Owner | User |
|---------|-------|-------|------|
| Create booking | ✅ | ✅ | ✅ |
| View all bookings | ✅ | ✅ | ✅ |
| Delete own bookings | ✅ | ✅ | ✅ |
| Delete any booking | ✅ | ✅ | ❌ |
| View bookings grouped by user | ✅ | ✅ | ❌ |
| View usage summary | ✅ | ✅ | ❌ |
| Create users | ✅ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ |

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Material UI
- Ant Design
- Axios

### Backend
- Next.js API Routes (Node.js)
- Prisma ORM
- PostgreSQL
- Day.js

---

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meeting-room-booking-sys.git
cd meeting-room-booking-sys