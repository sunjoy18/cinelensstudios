Next.js 14 (App Router)
├── /app
│   ├── page.tsx              → Homepage
│   ├── /portfolio            → Portfolio page
│   ├── /booking              → Booking form
│   ├── /packages             → Packages page
│   ├── /about                → About page
│   ├── /contact              → Contact page
│   └── /admin                → Protected dashboard
│       └── middleware.ts     → NextAuth route guard
│
├── /components               → Reusable UI components
├── /lib
│   ├── mongodb.ts            → Mongoose connection
│   ├── sanity.ts             → Sanity client
│   └── auth.ts               → NextAuth config
│
└── /app/api
    ├── /bookings             → POST → save to MongoDB
    ├── /contact              → POST → save + send email
    └── /auth/[...nextauth]   → Login handler