import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { getSiteSettings } from '@/lib/content';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message, source, preferredDate, location } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    await Contact.create({
      firstName,
      lastName: lastName || '',
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      source: source || '',
      preferredDate: preferredDate || '',
      location: location || '',
    });

    // Optional: Send email via Resend (requires RESEND_API_KEY)
    if (process.env.RESEND_API_KEY) {
      const settings = getSiteSettings();
      const resend = (await import('resend')).Resend;
      const resendClient = new resend(process.env.RESEND_API_KEY);

      await resendClient.emails.send({
        from: process.env.RESEND_FROM || 'CineLensStudios <onboarding@resend.dev>',
        to: settings.contact.email,
        subject: `New enquiry: ${subject || 'General'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || '—'}</p>
          <p><strong>Subject:</strong> ${subject || '—'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
