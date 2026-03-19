import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import { getSiteSettings } from '@/lib/content';

export type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  badge: string;
  bio: string;
  tags: string[];
  imagePublicId?: string;
  sortOrder?: number;
};

export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  try {
    await connectDB();

    const items = await TeamMember.find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    if (items.length > 0) {
      return items.map((item, i) => ({
        id: item._id?.toString() ?? `team-${i}`,
        name: item.name,
        role: item.role,
        badge: item.badge,
        bio: item.bio,
        tags: item.tags ?? [],
        imagePublicId: item.imagePublicId,
        sortOrder: item.sortOrder,
      }));
    }
  } catch {
    // Fall through to JSON fallback
  }

  const settings = getSiteSettings();
  const about = settings.aboutPage as { team: Array<{ name: string; role: string; badge: string; bio: string; tags: string[] }> };
  const jsonItems = about?.team ?? [];
  return jsonItems.map((item, i) => ({
    id: `team-json-${i}`,
    name: item.name,
    role: item.role,
    badge: item.badge,
    bio: item.bio,
    tags: item.tags ?? [],
    imagePublicId: undefined,
    sortOrder: i,
  }));
}
