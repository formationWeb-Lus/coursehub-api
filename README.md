# CourseHub API 🎓

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **OAuth2**, for managing an online course platform.

---

## 🚀 Live Demo

- 🔗 API on Render: [https://coursehub-api.onrender.com](https://coursehub-api.onrender.com)
- 📚 Swagger Docs: [https://coursehub-api.onrender.com/api-docs](https://coursehub-api.onrender.com/api-docs)
- 🎥 YouTube Demo Video: [https://youtube.com/your-video-link](https://youtube.com/your-video-link)

---

## 📁 MongoDB Collections

- `users` – handles user authentication (OAuth via Google)
- `courses` – includes title, description, level, image, etc.
- `categories` – course categories
- `reviews` – ratings and comments for courses
- `enrollments` – track course registrations

✅ At least one collection (`courses`) contains **7 or more fields**.

---

## 🔐 Authentication

- Google OAuth 2.0 authentication
- Implemented using Passport.js and `passport-google-oauth20`

---

## 🔧 API Features

- ✅ Fully functional GET, POST, PUT, DELETE routes
- ✅ Data validation with `express-validator`
- ✅ Global error handling middleware
- ✅ OAuth-based user management
- ✅ Unit tests on all GET routes using `jest` and `supertest`
- ✅ Swagger API documentation available at `/api-docs`

---

## 📦 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Passport.js (OAuth)
- Swagger UI
- Jest / Supertest
- Render (deployment)
- GitHub (version control)

---

## ⚙️ Local Setup

```bash
git clone https://github.com/formationWeb-Lus/coursehub-api.git
cd coursehub-api
npm install
cp .env.example .env
# Fill in variables like MONGO_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.
npm start
