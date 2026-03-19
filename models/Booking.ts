import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    package: { type: String, required: true },
    shootType: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String },
    referral: { type: String },
    message: { type: String },
    addons: { type: [String], default: [] },
    totalAmount: { type: Number },
    ref: { type: String },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
