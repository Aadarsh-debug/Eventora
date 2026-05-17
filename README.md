# Eventora

Eventora is a full-stack event booking and management platform where users can discover events, register securely using OTP verification, and book tickets online. Administrators can create and manage events, monitor bookings, and approve or reject booking requests through a dedicated admin dashboard.

---

# Features

## User Features

* User Authentication
* OTP Email Verification
* JWT Protected Routes
* Browse Events
* View Event Details
* Book Event Tickets
* Booking Cancellation
* User Dashboard
* Dynamic Seat Availability

## Admin Features

* Create Events
* Update Events
* Delete Events
* View All Bookings
* Approve/Reject Booking Requests
* Payment Status Management
* Admin Dashboard Analytics

---

# Tech Stack

## Frontend

* React
* React Router DOM
* Axios
* Tailwind CSS
* React Icons

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Nodemailer

---

# Project Architecture

## Frontend

The frontend is built using React and Tailwind CSS with a responsive modern UI. React Router is used for navigation and Axios handles API communication.

## Backend

The backend is built with Express.js and MongoDB. JWT authentication secures protected routes while Nodemailer handles OTP email verification.

---

# Main Functionalities

## Authentication System

* User Signup
* Login System
* OTP Verification
* JWT Token Generation
* Protected Routes
* Role Based Access

## Event System

* Create Events
* Display Events
* Event Details Page
* Event Search & Filtering
* Seat Availability Tracking

## Booking System

* OTP Booking Verification
* Booking Requests
* Booking Confirmation
* Booking Cancellation
* Admin Booking Approval

---

# API Routes

## Auth Routes

```bash
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verifyOTP
```

## Event Routes

```bash
GET /api/events
GET /api/events/:id
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id
```

## Booking Routes

```bash
POST /api/bookings/send-otp
POST /api/bookings
GET /api/bookings/my
PUT /api/bookings/:id/confirm
DELETE /api/bookings/:id
```

---

# Installation

## Clone Repository

```bash
git clone <your-repository-link>
```

---

# Backend Setup

```bash
cd server
npm install
```

## Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## Run Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# Screens Included

* Home Page
* Login Page
* Signup Page
* OTP Verification
* Event Detail Page
* User Dashboard
* Admin Dashboard

---

# Learning Outcomes

This project helped in understanding:

* Full Stack Development
* REST APIs
* MongoDB Relationships
* JWT Authentication
* OTP Verification Flow
* React Context API
* Protected Routes
* Axios API Handling
* Tailwind CSS Styling
* CRUD Operations
* Role Based Access Control

---

# Future Improvements

* Online Payment Gateway Integration
* Real-time Notifications
* Event Image Uploads
* QR Code Tickets
* Event Reviews & Ratings
* Search Optimization
* Paginati
