import mongoose from 'mongoose';

const PackageOfferSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    billingNote: { type: String, default: 'Per session · Fully edited' },
    featured: { type: Boolean, default: false },
    badge: { type: String },
    features: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PackageOffer || mongoose.model('PackageOffer', PackageOfferSchema);
