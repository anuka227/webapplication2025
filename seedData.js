import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Salon from './models/Salon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function seedDatabase() {
  try {
    // MongoDB холбогдох
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB холбогдлоо');

    // JSON файл унших
    const jsonPath = path.join(__dirname, './webapplication2025/salonPage/json/salon.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const salonsData = JSON.parse(jsonData);

    // Хуучин өгөгдөл устгах
    await Salon.deleteMany({});
    console.log('🗑️  Хуучин өгөгдөл устгагдлаа');

    // Шинэ өгөгдөл оруулах
    const result = await Salon.insertMany(salonsData.salons);
    console.log(`✅ ${result.length} салоны өгөгдөл амжилттай орууллаа`);

    // Холболт хаах
    await mongoose.connection.close();
    console.log('👋 Холболт хаагдлаа');
   
  } catch (error) {
    console.error('❌ Алдаа:', error);
    process.exit(1);
  }
}

seedDatabase();