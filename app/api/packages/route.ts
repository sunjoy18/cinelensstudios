import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PackageOffer from '@/models/PackageOffer';
import { isAdminRequest } from '@/lib/admin-auth';
import { getSiteSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getPackages } = await import('@/lib/packages');
    const items = await getPackages();
    const settings = getSiteSettings();
    return NextResponse.json({
      items,
      currency: settings.packages.currency,
      label: settings.packages.label,
      title: settings.packages.title,
      intro: settings.packages.intro,
    });
  } catch (error) {
    console.error('Packages API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, duration, price, billingNote, featured, badge, features, sortOrder } = body;

    if (!name || !duration || price == null) {
      return NextResponse.json({ error: 'Missing required fields: name, duration, price' }, { status: 400 });
    }

    await connectDB();

    const item = await PackageOffer.create({
      name,
      duration,
      price: Number(price),
      billingNote: billingNote || 'Per session · Fully edited',
      featured: !!featured,
      badge: badge || undefined,
      features: Array.isArray(features) ? features : [],
      sortOrder: sortOrder ?? 0,
    });

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
    console.error('Packages POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
