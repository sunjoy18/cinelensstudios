import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export type TestimonialType = {
  id: string;
  text: string;
  author: string;
  event: string;
  initials: string;
  stars: number;
};

function getInitials(author: string): string {
  return author
    .split(/[\s&]+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export async function getTestimonials(): Promise<TestimonialType[]> {
  try {
    await connectDB();

    const items = await Testimonial.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return items.map((item) => ({
      id: item._id?.toString() ?? '',
      text: item.text,
      author: item.author,
      event: item.event,
      initials: item.initials || getInitials(item.author),
      stars: item.stars ?? 5,
    }));
  } catch {
    return [];
  }
}
