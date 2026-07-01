import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema(
  {
    commonName: {
      type: String,
      required: true,
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    petSafe: {
      type: Boolean,
      default: false,
    },
    toxicity: {
      pets: String,
      humans: String,
      notes: String,
    },
    care: {
      light: String,
      water: String,
      humidity: String,
      temperature: String,
    },
    lightLevel: Number,
    waterLevel: Number,
    growingZones: {
      type: [String],
      default: [],
    },
    heatZones: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Plant', PlantSchema);
