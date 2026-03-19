import { connectDB } from '@/lib/mongodb';
import PortfolioItem from '@/models/PortfolioItem';

export type PortfolioItemType = {
  id: string;
  category: string;
  title: string;
  imagePublicId: string;
  sortOrder: number;
};

export async function getPortfolioItems(): Promise<PortfolioItemType[]> {
  try {
    await connectDB();

    const items = await PortfolioItem.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return items.map((item) => ({
      id: item._id?.toString() ?? '',
      category: item.category,
      title: item.title,
      imagePublicId: item.imagePublicId,
      sortOrder: item.sortOrder,
    }));
  } catch {
    return [];
  }
}
