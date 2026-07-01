import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be defined in .env');
  process.exit(1);
}

// Connect to MongoDB Atlas using environment variables.
connectDB();

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
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
  res.json({ status: 'ok', message: 'Greenlight backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
