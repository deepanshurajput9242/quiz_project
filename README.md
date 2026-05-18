# MERN Quiz Platform

A production-ready Quiz Platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Authentication**: JWT-based auth with HttpOnly cookies.
- **RBAC**: Role-based access control (Student, Teacher, Admin).
- **Quiz Management**: Teachers can create, update, delete quizzes.
- **Quiz Taking**: Timed quizzes with autosave (local storage).
- **Auto-grading**: Instant results and scoring.
- **Analytics**: Teachers can view quiz performance (basic stats).
- **UI**: Modern UI with Tailwind CSS and shadcn/ui.

## Tech Stack
- **Frontend**: Vite + React, Tailwind CSS, shadcn/ui, React Router, Axios, React Hook Form, Zod.
- **Backend**: Node.js, Express, Mongoose, JWT, Bcrypt.
- **Database**: MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone & Install
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database
Populate the database with initial data (Admin, Teacher, Student, Sample Quiz).
```bash
cd server
node seed.js
```
*Note: This clears existing data.*

### 4. Run Locally
**Server:**
```bash
cd server
npm run dev
```

**Client:**
```bash
cd client
npm run dev
```
Access the app at `http://localhost:5173`.

### 5. Run Tests
```bash
cd server
npm test
```

## Deployment

### Backend (Railway)
1. Connect your repo to Railway.
2. Set Root Directory to `server`.
3. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
4. Build Command: `npm install`
5. Start Command: `node index.js`

### Frontend (Netlify)
1. Connect your repo to Netlify.
2. Set Base Directory to `client`.
3. Build Command: `npm run build`.
4. Publish Directory: `dist`.
5. Add Environment Variable `VITE_API_URL` if you configured dynamic API URL (currently hardcoded in axios lib, you should update `client/src/lib/axios.js` to use `import.meta.env.VITE_API_URL`).

## Credentials (Seed Data)
- **Teacher**: `teacher@example.com` / `password123`
- **Student**: `student@example.com` / `password123`
