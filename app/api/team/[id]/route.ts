import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
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

    const setFields: Record<string, unknown> = {};
    const unsetFields: Record<string, unknown> = {};
    if (body.name != null) setFields.name = body.name;
    if (body.role != null) setFields.role = body.role;
    if (body.badge != null) setFields.badge = body.badge;
    if (body.bio != null) setFields.bio = body.bio;
    if (body.tags != null) setFields.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.imagePublicId !== undefined) {
      if (body.imagePublicId) setFields.imagePublicId = body.imagePublicId;
      else unsetFields.imagePublicId = 1;
    }
    if (body.sortOrder != null) setFields.sortOrder = body.sortOrder;

    const updateOp: Record<string, unknown> = {};
    if (Object.keys(setFields).length) updateOp.$set = setFields;
    if (Object.keys(unsetFields).length) updateOp.$unset = unsetFields;
    const item = await TeamMember.findByIdAndUpdate(id, Object.keys(updateOp).length ? updateOp : {}, { new: true });

    if (!item) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

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
    console.error('Team PATCH error:', error);
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

    const item = await TeamMember.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
