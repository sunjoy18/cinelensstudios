import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';

    let query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    let bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          (b.name as string)?.toLowerCase().includes(s) ||
          (b.package as string)?.toLowerCase().includes(s) ||
          (b.shootType as string)?.toLowerCase().includes(s) ||
          (b.ref as string)?.toLowerCase().includes(s) ||
          (b.date as Date)?.toString().includes(s)
      );
    }

    const data = bookings.map((b) => ({
      id: b._id?.toString(),
      ref: b.ref,
      name: b.name,
      email: b.email,
      phone: b.phone,
      package: b.package,
      shootType: b.shootType,
      date: b.date,
      time: b.time,
      location: b.location,
      addons: b.addons,
      totalAmount: b.totalAmount,
      status: b.status,
      message: b.message,
      createdAt: b.createdAt,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin bookings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
