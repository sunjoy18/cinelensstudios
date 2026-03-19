import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { isAdminRequest } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const items = await Testimonial.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    const data = items.map((item) => ({
      id: item._id?.toString(),
      text: item.text,
      author: item.author,
      event: item.event,
      initials: item.initials ?? '',
      stars: item.stars ?? 5,
      sortOrder: item.sortOrder ?? 0,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, author, event, initials, stars, sortOrder } = body;

    if (!text || !author || !event) {
      return NextResponse.json({ error: 'Missing required fields: text, author, event' }, { status: 400 });
    }

    await connectDB();

    const item = await Testimonial.create({
      text,
      author,
      event,
      initials: initials ?? '',
      stars: stars ?? 5,
      sortOrder: sortOrder ?? 0,
    });

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
    console.error('Testimonials POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
