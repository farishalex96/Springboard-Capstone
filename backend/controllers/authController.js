import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { getHardinessZone as lookupZone } from '../utils/hardinessZone.js';

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sendUserResponse = (user) => ({
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    favoritePlants: user.favoritePlants,
    growingZone: user.growingZone,
    heatZone: user.heatZone,
  },
});

export const register = async (req, res) => {
  try {
    const { username, email, password, growingZone, heatZone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email or username is already taken.' });
    }

    // Server-side password policy enforcement
    const validatePassword = (pw) => {
      if (!pw || pw.length < 8) return false;
      if (!/[A-Z]/.test(pw)) return false;
      if (!/[0-9]/.test(pw)) return false;
      if (!/[!@#$%^&*(),.?"{}|<>\[\]\\;:'`~_+=\-\/]/.test(pw)) return false;
      return true;
    };

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      growingZone,
      heatZone,
    });

    res.status(201).json({ token: signToken(user._id), ...sendUserResponse(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ token: signToken(user._id), ...sendUserResponse(user) });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(sendUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: 'Unable to load user profile', error: error.message });
  }
};

export const getHardinessZone = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid latitude or longitude.' });
    }

    const zone = lookupZone(latitude, longitude);
    if (!zone) {
      return res.status(400).json({ message: 'Location is outside supported US hardiness zone range.' });
    }

    res.json({ zone, latitude, longitude });
  } catch (error) {
    res.status(500).json({ message: 'Unable to determine hardiness zone', error: error.message });
  }
};
