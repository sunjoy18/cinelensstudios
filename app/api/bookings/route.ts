import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getSiteSettings } from '@/lib/content';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      package: pkg,
      shootType,
      date,
      time,
      location,
      referral,
      message,
      addons,
      totalAmount,
      ref,
    } = body;

    if (!name || !email || !pkg || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const bookingRef = ref || `CLS-${Math.floor(Math.random() * 9000 + 1000)}`;

    const booking = await Booking.create({
      name,
      email,
      phone: phone || '',
      package: pkg,
      shootType: shootType || '',
      date: new Date(date),
      time: time || '',
      location: location || '',
      referral: referral || '',
      message: message || '',
      addons: Array.isArray(addons) ? addons : [],
      totalAmount: totalAmount ?? null,
      ref: bookingRef,
      status: 'pending',
    });

    // Optional: Send email via Resend (requires RESEND_API_KEY)
    if (process.env.RESEND_API_KEY) {
      const settings = getSiteSettings();
      const resend = (await import('resend')).Resend;
      const resendClient = new resend(process.env.RESEND_API_KEY);

      await resendClient.emails.send({
        from: process.env.RESEND_FROM || 'CineLensStudios <onboarding@resend.dev>',
        to: settings.contact.email,
        subject: `New booking request: ${pkg} - ${date}`,
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || '—'}</p>
          <p><strong>Package:</strong> ${pkg}</p>
          <p><strong>Shoot Type:</strong> ${shootType || '—'}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time || '—'}</p>
          <p><strong>Location:</strong> ${location || '—'}</p>
          <p><strong>Referral:</strong> ${referral || '—'}</p>
          <p><strong>Add-ons:</strong> ${Array.isArray(addons) ? addons.join(', ') : '—'}</p>
          <p><strong>Total:</strong> ${totalAmount ? `₹${totalAmount.toLocaleString('en-IN')}` : '—'}</p>
          <p><strong>Message:</strong></p>
          <p>${message || '—'}</p>
        `,
      });
    }

    return NextResponse.json({ success: true, ref: bookingRef });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
