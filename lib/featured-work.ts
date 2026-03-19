import { connectDB } from '@/lib/mongodb';
import PortfolioItem from '@/models/PortfolioItem';
import { getSiteSettings } from '@/lib/content';

export type FeaturedWorkItem = {
  category: string;
  title: string;
  imagePublicId: string;
};

export async function getFeaturedWork(): Promise<FeaturedWorkItem[]> {
  try {
    await connectDB();

    const items = await PortfolioItem.find({ featured: true })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(4)
      .lean();

    if (items.length > 0) {
      return items.map((item) => ({
        category: item.category,
        title: item.title,
        imagePublicId: item.imagePublicId,
      }));
    }
  } catch {
    // Fall through to JSON fallback
  }

  const settings = getSiteSettings();
  const jsonItems = (settings.featuredWork as { items: Array<{ category: string; title: string; imagePublicId?: string }> })?.items ?? [];
  return jsonItems.slice(0, 4).map((item) => ({
    category: item.category,
    title: item.title,
    imagePublicId: item.imagePublicId || '',
  }));
}
