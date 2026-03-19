'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavProps = {
  nav: {
    links: Array<{ label: string; href: string }>;
    cta: string;
    ctaHref: string;
  };
  site: {
    logoPrimary?: string;
    logoHighlight?: string;
  };
};

export function NavClient({ nav, site }: NavProps) {
  const pathname = usePathname();

  return (
    <nav
      id="mainNav"
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-16 py-5 bg-gradient-to-b from-black/92 to-transparent backdrop-blur-sm transition-colors duration-300"
    >
      <Link href="/" className="font-serif text-xl font-light tracking-[0.08em] text-white no-underline">
        {site.logoPrimary || 'CineLens'}<span className="text-green">{site.logoHighlight || 'Studios'}</span>
      </Link>
      <ul className="hidden md:flex gap-10 list-none">
        {nav.links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[0.78rem] tracking-[0.14em] uppercase no-underline transition-colors hover:text-white ${
                  isActive ? 'text-green' : 'text-[var(--muted)]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={nav.ctaHref}
        className="text-[0.78rem] tracking-[0.12em] uppercase text-green border border-[var(--border-green)] px-5 py-2.5 rounded-sm no-underline transition-colors hover:bg-[var(--green-glow)]"
      >
        {nav.cta}
      </Link>
    </nav>
  );
}
