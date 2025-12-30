import mongoose from 'mongoose';
 
const salonSchema = new mongoose.Schema({
  id: String,
  name: String,
  img: String,
  description: String,
  mission: String,
  rating: Number,
  reviews_count: Number,
  special: String,
  location: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  schedule: String,
  date: [String],
  time: [String],
  creative: [Object],
  service: [Object],
  artists: [Object]
}, {
  collection: 'salons',
  timestamps: true
});
 
export default mongoose.model('Salon', salonSchema);