import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .lean();

    const data = contacts.map((c) => ({
      id: c._id?.toString(),
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      subject: c.subject,
      message: c.message,
      read: (c as { read?: boolean }).read ?? false,
      createdAt: c.createdAt,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin contacts API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
