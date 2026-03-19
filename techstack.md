Frontend — Next.js 14 (App Router)
The natural evolution of your current HTML pages. App Router gives you server components, built-in image optimisation (critical for a photography site), and seamless Vercel deployment. Pair it with Tailwind CSS to replicate your existing dark/green design system cleanly, and Framer Motion for the scroll animations and transitions you already have.

CMS — Sanity v3
Already in your plan and the right call. You get a hosted content studio your client can open in any browser — no code, no deployments. Define schemas for Packages, Portfolio items, Testimonials, Team members, and Contact info. Changes go live instantly via Sanity's CDN. The free tier covers everything you need at this stage.

Database — MongoDB Atlas (via Mongoose)
For booking form submissions and contact enquiries. Atlas free tier handles thousands of documents. Use Mongoose for typed schemas that mirror your booking data model exactly. When you're ready for payment integration, adding a paymentStatus field is a one-line schema change.

Authentication — NextAuth.js
Replace your current sessionStorage admin login with a proper credentials provider backed by a hashed password in your .env. Single admin user to start — no external OAuth needed. JWT sessions, automatic redirect to /admin on success, middleware protection on all /admin/* routes.

Email — Resend + React Email
When a booking is submitted, fire a confirmation to the client and a notification to you. Resend has a generous free tier (3,000 emails/month), React Email lets you write beautiful HTML emails as React components, and setup takes about 20 minutes.

Hosting — Vercel
Already in your plan. Zero-config Next.js deployment, automatic preview URLs for every branch, edge caching for your image-heavy portfolio, and free SSL. Your domain connects in under 5 minutes.

Image Storage — Cloudinary
Don't store portfolio images in your repo or MongoDB. Cloudinary gives you on-the-fly resizing, WebP conversion, lazy-load blur placeholders, and a clean upload widget for your client to add new portfolio images without touching code. Free tier covers 25GB storage.

WhatsApp Notifications — Twilio or Meta Cloud API
When a booking comes in, send yourself a WhatsApp message with the client's name, package, and date. Twilio's WhatsApp sandbox is free to test; the Meta Cloud API is free in production up to 1,000 conversations/month.