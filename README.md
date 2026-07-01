# Greenlight

Greenlight is an indoor plant care and management application scaffolded with a React/Vite frontend and a Node.js/Express backend.

## Structure

- `frontend/` - React application with Tailwind CSS, React Router, Axios, and Framer Motion.
- `backend/` - Express server with MongoDB connection, JWT authentication placeholders, and scalable route/controller structure.

## Scripts

- `npm run dev` - run frontend and backend concurrently
- `npm run install:all` - install dependencies in root, frontend, and backend

## Environment

Do not deploy local `.env` files. Set these variables in your deployment host instead:

- `MONGODB_URI` - MongoDB Atlas connection string for the `greenlight` database
- `JWT_SECRET` - long random secret used to sign auth tokens
- `PORT` - backend port, usually supplied by the host
- `FRONTEND_URL` - deployed frontend URL allowed by backend CORS
- `VITE_API_URL` - deployed backend URL used by the frontend build

Use `backend/.env.example` as the template for local setup.
