import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
 
import Salon from './models/Salon.js';
import authRoutes from './routes/auth.js';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
 
// ✅ Static files үйлчлүүлэх (frontend файлууд)
app.use(express.static(__dirname));
 
// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB холбогдлоо'))
  .catch(err => console.error('❌ MongoDB холболтын алдаа:', err));
 
// Auth routes
app.use('/api/auth', authRoutes);
 
// Salons API
app.get('/api/salons', async (req, res) => {
  try {
    const salons = await Salon.find();
    res.json({ salons });
  } catch (error) {
    console.error('Алдаа:', error);
    res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа' });
  }
});
 
app.get('/api/salons/:id', async (req, res) => {
  try {
    const salon = await Salon.findOne({ id: req.params.id });
    if (!salon) {
      return res.status(404).json({ error: 'Салон олдсонгүй' });
    }
    res.json(salon);
  } catch (error) {
    console.error('Алдаа:', error);
    res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа' });
  }
});
 
app.get('/api/independent-artists', async (req, res) => {
  try {
    const independent = await Salon.findOne({ id: 'independent' });
    if (!independent) {
      return res.status(404).json({ error: 'Independent artists олдсонгүй' });
    }
    res.json({ artists: independent.artists });
  } catch (error) {
    console.error('Алдаа:', error);
    res.status(500).json({ error: 'Өгөгдөл татахад алдаа гарлаа' });
  }
});
 
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} дээр ажиллаж байна`);
});