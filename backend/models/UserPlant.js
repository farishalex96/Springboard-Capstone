import mongoose from 'mongoose';

const calculateNextWateringDate = (lastWatered, wateringFrequencyDays) => {
  if (!lastWatered || !wateringFrequencyDays) return null;

  const frequencyDays = Number(wateringFrequencyDays);
  const wateredDate = new Date(lastWatered);

  if (!Number.isFinite(frequencyDays) || frequencyDays < 1 || Number.isNaN(wateredDate.getTime())) {
    return null;
  }

  const nextWateringDate = new Date(wateredDate);
  nextWateringDate.setUTCDate(nextWateringDate.getUTCDate() + Math.floor(frequencyDays));
  return nextWateringDate;
};

const UserPlantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true,
    },
    nickname: String,
    location: String,
    acquiredDate: Date,
    lastWatered: Date,
    nextWateringDate: Date,
    wateringFrequencyDays: {
      type: Number,
      min: 1,
    },
    lastFertilized: Date,
    careStatus: {
      type: String,
      enum: ['not-started', 'on-track', 'due-soon', 'overdue', 'needs-attention'],
      default: 'not-started',
    },
    notes: String,
  },
  {
    timestamps: true,
  },
);

UserPlantSchema.pre('validate', function calculateWateringSchedule(next) {
  this.nextWateringDate = calculateNextWateringDate(this.lastWatered, this.wateringFrequencyDays);
  next();
});

export default mongoose.model('UserPlant', UserPlantSchema);
