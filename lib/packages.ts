import { connectDB } from '@/lib/mongodb';
import PackageOffer from '@/models/PackageOffer';
import { getSiteSettings } from '@/lib/content';

export type PackageItem = {
  id: string;
  name: string;
  duration: string;
  price: number;
  billingNote: string;
  featured: boolean;
  badge?: string;
  features: string[];
  sortOrder?: number;
};

export async function getPackages(): Promise<PackageItem[]> {
  try {
    await connectDB();

    const items = await PackageOffer.find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    if (items.length > 0) {
      return items.map((item, i) => ({
        id: item._id?.toString() ?? `pkg-${i}`,
        name: item.name,
        duration: item.duration,
        price: item.price,
        billingNote: item.billingNote,
        featured: item.featured,
        badge: item.badge,
        features: item.features ?? [],
        sortOrder: item.sortOrder,
      }));
    }
  } catch {
    // Fall through to JSON fallback
  }

  const settings = getSiteSettings();
  const jsonItems = settings.packages.items;
  return jsonItems.map((item: { id: string; name: string; duration: string; price: number; billingNote: string; featured: boolean; badge?: string; features: string[] }, i: number) => ({
    id: item.id,
    name: item.name,
    duration: item.duration,
    price: item.price,
    billingNote: item.billingNote,
    featured: item.featured,
    badge: item.badge,
    features: item.features ?? [],
    sortOrder: i,
  }));
}
