import Link from 'next/link';
import { getSiteSettings } from '@/lib/content';
import { getPackages } from '@/lib/packages';
import { Emphasis } from '@/components/Emphasis';
import { BookingForm } from '@/components/BookingForm';

export default async function BookingPage() {
  const settings = getSiteSettings();
  const packageItems = await getPackages();
  const mergedSettings = { ...settings, packages: { ...settings.packages, items: packageItems } };
  const booking = settings.bookingPage as {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  return (
    <>
      <div className="pt-24 pb-16 px-8 md:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_0%_50%,rgba(46,204,138,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[680px]">
          <span className="text-[0.68rem] tracking-[0.28em] uppercase text-green mb-4 block">
            {booking.eyebrow}
          </span>
          <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-light leading-[1.1] text-white">
            <Emphasis text={booking.title} />
          </h1>
          <p className="text-[var(--muted)] leading-relaxed mt-5 max-w-[500px]">
            {booking.subtitle}
          </p>
        </div>
      </div>

      <BookingForm settings={mergedSettings} />
    </>
  );
}
