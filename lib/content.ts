import fs from 'fs';
import path from 'path';

export type SiteSettings = {
  site: {
    name: string;
    logoPrimary?: string;
    logoHighlight?: string;
    tagline: string;
    description: string;
    copyright: string;
    foundedYear: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    email: string;
    whatsapp: string;
    responseTime: string;
    availability: string;
  };
  social: Array<{
    platform: string;
    handle: string;
    url: string;
    icon: string;
  }>;
  hours: Array<{ days: string; time: string; closed?: boolean }>;
  hoursNote: string;
  locations: Array<{
    type: string;
    name: string;
    address: string;
    mapsQuery?: string;
    mapsUrl: string | null;
    bookingLink?: boolean;
  }>;
  mapAddress: {
    label: string;
    name: string;
    line1: string;
    line2: string;
    mapsQuery: string;
  };
  nav: {
    links: Array<{ label: string; href: string }>;
    cta: string;
    ctaHref: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
    scrollLabel: string;
  };
  featuredWork: {
    label: string;
    title: string;
    items: Array<{ category: string; title: string; image: string | null }>;
  };
  about: {
    label: string;
    title: string;
    paragraphs: string[];
    quote: string;
    stats: Array<{ value: string; label: string }>;
  };
  beliefs: {
    label: string;
    title: string;
    items: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
  };
  packages: {
    label: string;
    title: string;
    intro: string;
    currency: string;
    items: Array<{
      id: string;
      name: string;
      duration: string;
      price: number;
      billingNote: string;
      featured: boolean;
      badge?: string;
      features: string[];
    }>;
  };
  testimonials: {
    label: string;
    title: string;
    items: Array<{
      text: string;
      author: string;
      event: string;
      initials: string;
      stars: number;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryCta: string;
    primaryCtaHref: string;
    secondaryCta: string;
    secondaryCtaHref: string;
  };
  contactPage: Record<string, unknown>;
  faq: {
    contact: Array<{ question: string; answer: string }>;
    packages: Array<{ question: string; answer: string }>;
  };
  aboutPage: Record<string, unknown>;
  portfolioPage: Record<string, unknown>;
  bookingPage: Record<string, unknown>;
};

let cachedSettings: SiteSettings | null = null;


export function getSiteSettings(): SiteSettings {
  if (cachedSettings) return cachedSettings;

  const filePath = path.join(process.cwd(), 'content', 'site-settings.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedSettings = JSON.parse(fileContents) as SiteSettings;

  return cachedSettings;
}
