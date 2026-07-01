import UserPlant from '../models/UserPlant.js';
import Plant from '../models/Plant.js';

export const getMyPlants = async (req, res) => {
  try {
    const myPlants = await UserPlant.find({ userId: req.user.id }).populate('plantId');
    res.json(myPlants);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load your plants', error: error.message });
  }
};

export const addMyPlant = async (req, res) => {
  try {
    const {
      plantId,
      nickname,
      location,
      acquiredDate,
      lastWatered,
      wateringFrequencyDays,
      lastFertilized,
      careStatus,
      notes,
    } = req.body;

    if (!plantId) {
      return res.status(400).json({ message: 'Plant ID is required.' });
    }

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found.' });
    }

    const existing = await UserPlant.findOne({ userId: req.user.id, plantId });
    if (existing) {
      return res.status(200).json({ message: 'Plant already exists in your collection.', userPlant: existing });
    }

    const userPlant = await UserPlant.create({
      userId: req.user.id,
      plantId,
      nickname,
      location,
      acquiredDate,
      lastWatered,
      wateringFrequencyDays,
      lastFertilized,
      careStatus,
      notes,
    });

    const populated = await userPlant.populate('plantId');
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid plant ID provided' });
    }
    res.status(500).json({ message: 'Unable to add plant to collection', error: error.message });
  }
};

export const updateMyPlant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nickname,
      location,
      acquiredDate,
      lastWatered,
      wateringFrequencyDays,
      lastFertilized,
      careStatus,
      notes,
    } = req.body;

    const userPlant = await UserPlant.findById(id);
    if (!userPlant || String(userPlant.userId) !== String(req.user.id)) {
      return res.status(404).json({ message: 'Plant not found in your collection.' });
    }

    if (nickname !== undefined) userPlant.nickname = nickname;
    if (location !== undefined) userPlant.location = location;
    if (acquiredDate !== undefined) userPlant.acquiredDate = acquiredDate;
    if (lastWatered !== undefined) userPlant.lastWatered = lastWatered;
    if (wateringFrequencyDays !== undefined) userPlant.wateringFrequencyDays = wateringFrequencyDays;
    if (lastFertilized !== undefined) userPlant.lastFertilized = lastFertilized;
    if (careStatus !== undefined) userPlant.careStatus = careStatus;
    if (notes !== undefined) userPlant.notes = notes;

    await userPlant.save();
    const populated = await userPlant.populate('plantId');
    res.json(populated);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid collection item ID provided' });
    }
    res.status(500).json({ message: 'Unable to update plant', error: error.message });
  }
};

export const deleteMyPlant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserPlant.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: 'Plant not found in your collection.' });
    }

    res.json({ message: 'Plant removed from your collection.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid collection item ID provided' });
    }
    res.status(500).json({ message: 'Unable to remove plant', error: error.message });
  }
};
