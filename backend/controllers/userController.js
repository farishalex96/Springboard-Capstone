import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, growingZone, heatZone, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Email change requires password verification
    if (email && email !== user.email) {
      if (!password) {
        return res.status(400).json({ message: 'Password is required to change email.' });
      }

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      // Check if new email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use.' });
      }

      user.email = email;
    }

    if (growingZone !== undefined) user.growingZone = growingZone;
    if (heatZone !== undefined) user.heatZone = heatZone;

    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        favoritePlants: user.favoritePlants,
        growingZone: user.growingZone,
        heatZone: user.heatZone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update profile', error: error.message });
  }
};
