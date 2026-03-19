import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PortfolioItem from '@/models/PortfolioItem';
import { isAdminRequest } from '@/lib/admin-auth';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const update: Record<string, unknown> = {};
    if (body.category != null) update.category = body.category;
    if (body.title != null) update.title = body.title;
    if (body.imagePublicId != null) update.imagePublicId = body.imagePublicId;
    if (body.featured !== undefined) update.featured = !!body.featured;
    if (body.featuredOrder !== undefined) update.featuredOrder = Number(body.featuredOrder);

    const item = await PortfolioItem.findByIdAndUpdate(id, update, { new: true });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

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
    console.error('Portfolio PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await connectDB();

    const item = await PortfolioItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
