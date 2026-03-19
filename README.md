# CineLensStudios — Next.js Website

A cinematic photography studio website built with Next.js 14, Tailwind CSS, and Framer Motion. **All site content is managed from a single JSON file** so your client can update everything without touching code.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, etc.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content Management — Single JSON File

**Everything is in `content/site-settings.json`.** Your client can edit this file to update:

- **Site info** — Name, tagline, copyright
- **Contact** — Phone, email, WhatsApp, social links
- **Hours & locations** — Studio hours, addresses, maps
- **Hero** — Eyebrow, title, tagline, CTAs
- **Pages** — About, packages, testimonials, FAQ, team, etc.

No CMS login required for basic updates. Just edit the JSON and redeploy.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Framer Motion |
| CMS | Sanity v3 (optional — for portfolio, packages) |
| Database | MongoDB Atlas (bookings, contact) |
| Auth | NextAuth.js (admin) |
| Email | Resend (notifications) |
| Images | Cloudinary (optional) |
| Hosting | Vercel |

## Project Structure

```
content/
  site-settings.json    ← Single source for all content
app/
  page.tsx              → Homepage
  about/
  contact/
  portfolio/
  packages/
  booking/
  admin/                → Protected dashboard
  api/
    contact/            → POST contact form
    bookings/           → POST booking form
    settings/           → GET site settings (JSON)
components/
lib/
  content.ts            → Loads site-settings.json
  mongodb.ts
  sanity.ts
models/
  Booking.ts
  Contact.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI` — Required for bookings and contact form
- `NEXT_PUBLIC_SANITY_*` — Optional, for Sanity CMS
- `RESEND_API_KEY` — Optional, for email notifications
- `NEXTAUTH_*` — For admin login

## JSON Format

Use `{em}text{/em}` for italic green text and `{strong}text{/strong}` for bold white text. Use `\n` for line breaks in titles.

Example:
```json
"title": "We Tell Stories\nThrough {em}Light{/em}"
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

The site will read `content/site-settings.json` at build time. To update content, edit the JSON and push — or set up a simple CMS later.
