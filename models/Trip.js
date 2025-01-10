import mongoose, { STATES } from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  endLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  travelMode: { type: String, enum: ['car', 'motorcycle', 'bicycle'], required: true },
  trafficConditions: [{ type: String }],
  weatherConditions: [{ type: String }],
  distance: { type: Number },
  duration: { type: Number },
  notes: { type: String },
  timestamps: {
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
});

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
