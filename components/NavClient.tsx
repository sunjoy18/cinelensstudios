'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        id="mainNav"
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-6 md:px-16 py-3 sm:py-4 md:py-5 bg-gradient-to-b from-black/92 to-transparent backdrop-blur-sm transition-colors duration-300"
      >
        <Link href="/" className="font-serif text-lg sm:text-xl font-light tracking-[0.08em] text-white no-underline">
          {site.logoPrimary || 'CineLens'}<span className="text-green">{site.logoHighlight || 'Studios'}</span>
        </Link>
        <ul className="hidden md:flex gap-8 lg:gap-10 list-none">
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
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={nav.ctaHref}
            className="hidden sm:inline-flex text-[0.72rem] sm:text-[0.78rem] tracking-[0.12em] uppercase text-green border border-[var(--border-green)] px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm no-underline transition-colors hover:bg-[var(--green-glow)]"
          >
            {nav.cta}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 border border-[var(--border)] rounded-sm bg-transparent text-white cursor-pointer hover:border-[var(--border-green)] transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`w-5 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 w-full max-w-[300px] z-[100] bg-dark border-l border-[var(--border)] flex flex-col pt-14 px-5 pb-6 transition-transform duration-300 ease-out shadow-2xl ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col gap-0.5 list-none">
          {nav.links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-3.5 text-[0.9rem] tracking-[0.12em] uppercase no-underline transition-colors active:text-green ${
                    isActive ? 'text-green' : 'text-[var(--muted)] hover:text-white'
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
          className="mt-5 inline-flex justify-center text-[0.8rem] tracking-[0.12em] uppercase text-green border-2 border-[var(--border-green)] px-6 py-3.5 rounded-sm no-underline transition-colors hover:bg-[var(--green-glow)] active:scale-[0.98]"
        >
          {nav.cta}
        </Link>
      </div>
    </>
  );
}
