import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Plant from '../models/Plant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const plantFilePath = path.join(__dirname, 'plants.json');

const seedPlants = async () => {
  try {
    await connectDB();

    const fileContents = await fs.readFile(plantFilePath, 'utf-8');
    const plants = JSON.parse(fileContents);

    if (!Array.isArray(plants) || plants.length === 0) {
      throw new Error('No plant data found to seed.');
    }

    await Plant.deleteMany({});
    const inserted = await Plant.insertMany(plants);

    console.log(`Seeded ${inserted.length} plants into MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed plants:', error);
    process.exit(1);
  }
};

seedPlants();
