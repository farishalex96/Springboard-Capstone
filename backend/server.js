import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import plantRoutes from './routes/plants.js';
import favoritesRoutes from './routes/favorites.js';
import myPlantsRoutes from './routes/myPlants.js';
import userPlantsRoutes from './routes/userPlants.js';
import userRoutes from './routes/users.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => normalizeOrigin(origin.trim())).filter(Boolean)
  : [];
const allowedRenderHost = /\.onrender\.com$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;

  try {
    const url = new URL(normalizeOrigin(origin));
    return allowedOrigins.includes(normalizeOrigin(origin)) || allowedRenderHost.test(url.hostname);
  } catch {
    return false;
  }
};

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be defined in .env');
  process.exit(1);
}

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

// API route placeholders for authentication, plants, user plant collection, and users.
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/myplants', myPlantsRoutes);
app.use('/api/user-plants', userPlantsRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    message: 'Greenlight backend is running.',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
