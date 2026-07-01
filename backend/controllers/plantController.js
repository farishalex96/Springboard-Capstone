import Plant from '../models/Plant.js';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseBoolean = (value) => {
  if (typeof value !== 'string') return undefined;
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};

export const getPlants = async (req, res) => {
  try {
    const {
      search,
      category,
      difficulty,
      size,
      petSafe,
      humanSafe,
      lightLevel,
      waterLevel,
      growingZone,
      heatZone,
    } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(escapeRegExp(search), 'i');
      filter.$or = [
        { commonName: regex },
        { scientificName: regex },
      ];
    }

    if (category) {
      filter.category = new RegExp(`^${escapeRegExp(category)}$`, 'i');
    }

    if (difficulty) {
      filter.difficulty = new RegExp(`^${escapeRegExp(difficulty)}$`, 'i');
    }

    if (size) {
      filter.size = new RegExp(`^${escapeRegExp(size)}$`, 'i');
    }

    if (parseBoolean(petSafe)) {
      filter.petSafe = true;
    }

    if (parseBoolean(humanSafe)) {
      filter['toxicity.humans'] = new RegExp('^non-toxic$', 'i');
    }

    if (lightLevel) {
      const value = Number(lightLevel);
      if (!Number.isNaN(value)) {
        filter.lightLevel = value;
      }
    }

    if (waterLevel) {
      const value = Number(waterLevel);
      if (!Number.isNaN(value)) {
        filter.waterLevel = value;
      }
    }

    if (growingZone) {
      filter.growingZones = String(growingZone);
    }

    if (heatZone) {
      filter.heatZones = String(heatZone);
    }

    const plants = await Plant.find(filter)
      .select('commonName scientificName imageUrl description category difficulty size petSafe toxicity care lightLevel waterLevel growingZones heatZones')
      .sort({ commonName: 1 })
      .limit(100);

    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load plants', error: error.message });
  }
};

export const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findById(id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(plant);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid plant ID provided' });
    }
    res.status(500).json({ message: 'Unable to load plant', error: error.message });
  }
};
