import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
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
    if (body.text != null) update.text = body.text;
    if (body.author != null) update.author = body.author;
    if (body.event != null) update.event = body.event;
    if (body.initials != null) update.initials = body.initials;
    if (body.stars !== undefined) update.stars = Number(body.stars);
    if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder);

    const item = await Testimonial.findByIdAndUpdate(id, update, { new: true });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: item._id?.toString(),
      text: item.text,
      author: item.author,
      event: item.event,
      initials: item.initials,
      stars: item.stars,
      sortOrder: item.sortOrder,
    });
  } catch (error) {
    console.error('Testimonial PATCH error:', error);
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

    const item = await Testimonial.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Testimonial delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
