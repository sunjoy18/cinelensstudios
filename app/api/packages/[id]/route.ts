import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PackageOffer from '@/models/PackageOffer';
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
    if (body.name != null) update.name = body.name;
    if (body.duration != null) update.duration = body.duration;
    if (body.price != null) update.price = Number(body.price);
    if (body.billingNote != null) update.billingNote = body.billingNote;
    if (body.featured != null) update.featured = !!body.featured;
    if (body.badge != null) update.badge = body.badge;
    if (body.features != null) update.features = Array.isArray(body.features) ? body.features : [];
    if (body.sortOrder != null) update.sortOrder = body.sortOrder;

    const item = await PackageOffer.findByIdAndUpdate(id, update, { new: true });

    if (!item) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: item._id?.toString(),
      name: item.name,
      duration: item.duration,
      price: item.price,
      billingNote: item.billingNote,
      featured: item.featured,
      badge: item.badge,
      features: item.features,
      sortOrder: item.sortOrder,
    });
  } catch (error) {
    console.error('Package PATCH error:', error);
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

    const item = await PackageOffer.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Package DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
