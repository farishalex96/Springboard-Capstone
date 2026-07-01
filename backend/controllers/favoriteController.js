import Plant from '../models/Plant.js';
import User from '../models/User.js';

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoritePlants');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favoritePlants);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load favorites', error: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { plantId } = req.params;

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.favoritePlants.some((favoriteId) => String(favoriteId) === plantId)) {
      return res.status(200).json({ message: 'Plant already in favorites', favoritePlants: user.favoritePlants });
    }

    user.favoritePlants.push(plantId);
    await user.save();

    await user.populate('favoritePlants');
    res.status(201).json({ message: 'Plant added to favorites', favoritePlants: user.favoritePlants });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid plant ID provided' });
    }
    res.status(500).json({ message: 'Unable to add favorite', error: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { plantId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wasFavorited = user.favoritePlants.includes(plantId);
    user.favoritePlants = user.favoritePlants.filter((id) => id.toString() !== plantId);
    await user.save();

    await user.populate('favoritePlants');
    if (!wasFavorited) {
      return res.status(200).json({ message: 'Plant was not in favorites', favoritePlants: user.favoritePlants });
    }

    res.json({ message: 'Plant removed from favorites', favoritePlants: user.favoritePlants });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid plant ID provided' });
    }
    res.status(500).json({ message: 'Unable to remove favorite', error: error.message });
  }
};
