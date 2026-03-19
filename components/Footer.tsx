import Link from 'next/link';
import { getSiteSettings } from '@/lib/content';

export function Footer() {
  const { nav, site } = getSiteSettings();

  return (
    <footer className="px-8 md:px-16 py-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6 flex-wrap bg-dark">
      <div className="font-serif text-lg font-light text-[var(--muted)]">
        {site.logoPrimary || 'CineLens'}
        <span className="text-green">{site.logoHighlight || 'Studios'}</span>
      </div>
      <ul className="flex gap-8 list-none">
        {nav.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.72rem] tracking-[0.14em] uppercase text-[var(--muted)] no-underline transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="text-[0.72rem] text-white/25">{site.copyright}</div>
    </footer>
  );
}
