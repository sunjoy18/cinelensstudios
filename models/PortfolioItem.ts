import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    featuredOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PortfolioItem || mongoose.model('PortfolioItem', PortfolioItemSchema);
