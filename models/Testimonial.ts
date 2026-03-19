import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    event: { type: String, required: true },
    initials: { type: String, default: '' },
    stars: { type: Number, default: 5 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
