import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import { isAdminRequest } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getTeamMembers } = await import('@/lib/team');
    const items = await getTeamMembers();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Team API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, badge, bio, tags, imagePublicId, sortOrder } = body;

    if (!name || !role || !badge || !bio) {
      return NextResponse.json({ error: 'Missing required fields: name, role, badge, bio' }, { status: 400 });
    }

    await connectDB();

    const item = await TeamMember.create({
      name,
      role,
      badge,
      bio,
      tags: Array.isArray(tags) ? tags : [],
      imagePublicId: imagePublicId || undefined,
      sortOrder: sortOrder ?? 0,
    });

    return NextResponse.json({
      id: item._id?.toString(),
      name: item.name,
      role: item.role,
      badge: item.badge,
      bio: item.bio,
      tags: item.tags,
      imagePublicId: item.imagePublicId,
      sortOrder: item.sortOrder,
    });
  } catch (error) {
    console.error('Team POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
