import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PortfolioItem from '@/models/PortfolioItem';
import { isAdminRequest } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const items = await PortfolioItem.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    const data = items.map((item) => ({
      id: item._id?.toString(),
      category: item.category,
      title: item.title,
      imagePublicId: item.imagePublicId,
      sortOrder: item.sortOrder,
      featured: item.featured ?? false,
      featuredOrder: item.featuredOrder ?? 0,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, title, imagePublicId, sortOrder, featured, featuredOrder } = body;

    if (!category || !title || !imagePublicId) {
      return NextResponse.json({ error: 'Missing required fields: category, title, imagePublicId' }, { status: 400 });
    }

    await connectDB();

    const item = await PortfolioItem.create({
      category,
      title,
      imagePublicId,
      sortOrder: sortOrder ?? 0,
      featured: !!featured,
      featuredOrder: featuredOrder ?? 0,
    });

    return NextResponse.json({
      id: item._id?.toString(),
      category: item.category,
      title: item.title,
      imagePublicId: item.imagePublicId,
      sortOrder: item.sortOrder,
      featured: item.featured,
      featuredOrder: item.featuredOrder,
    });
  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
