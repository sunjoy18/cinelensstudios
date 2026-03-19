'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CldUploadWidget, CldImage } from 'next-cloudinary';

type Booking = {
  id: string;
  ref: string;
  name: string;
  email: string;
  phone: string;
  package: string;
  shootType: string;
  date: string;
  time: string;
  location: string;
  addons: string[];
  totalAmount: number;
  status: string;
  message: string;
  createdAt: string;
};

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type PortfolioItem = {
  id: string;
  category: string;
  title: string;
  imagePublicId: string;
  sortOrder?: number;
  featured?: boolean;
  featuredOrder?: number;
};

type PackageItem = {
  id: string;
  name: string;
  duration: string;
  price: number;
  billingNote: string;
  featured: boolean;
  badge?: string;
  features: string[];
  sortOrder?: number;
};

type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  badge: string;
  bio: string;
  tags: string[];
  imagePublicId?: string;
  sortOrder?: number;
};

const AVATAR_COLORS = ['#1a7a51', '#4a9eff', '#e6a817', '#e05252', '#7b5ea7', '#2ecc8a'];

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getFetchOpts() {
  return { credentials: 'include' as RequestCredentials };
}

export function AdminDashboard() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [panel, setPanel] = useState<'overview' | 'bookings' | 'enquiries' | 'portfolio' | 'packages' | 'team' | 'settings'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [modalBooking, setModalBooking] = useState<Booking | null>(null);
  const [modalStatus, setModalStatus] = useState('');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Wedding');
  const [newItemPublicId, setNewItemPublicId] = useState('');
  const [newItemFeatured, setNewItemFeatured] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [packageItems, setPackageItems] = useState<PackageItem[]>([]);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [newPackage, setNewPackage] = useState({ name: '', duration: '', price: '', billingNote: 'Per session · Fully edited', featured: false, badge: '', features: '' });
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMemberItem | null>(null);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', badge: '', bio: '', tags: '', imagePublicId: '' });

  useEffect(() => {
    fetch('/api/admin/me', getFetchOpts())
      .then((r) => r.json())
      .then((d) => setAuth(d.authenticated))
      .catch(() => setAuth(false));
  }, []);

  useEffect(() => {
    if (auth) {
      fetch('/api/admin/bookings', getFetchOpts())
        .then((r) => (r.ok ? r.json() : []))
        .then(setBookings)
        .catch(() => setBookings([]));
      fetch('/api/admin/contacts', getFetchOpts())
        .then((r) => (r.ok ? r.json() : []))
        .then(setContacts)
        .catch(() => setContacts([]));
      fetch('/api/portfolio', getFetchOpts())
        .then((r) => (r.ok ? r.json() : []))
        .then(setPortfolioItems)
        .catch(() => setPortfolioItems([]));
      fetch('/api/packages', getFetchOpts())
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .then((d) => setPackageItems(d.items || []))
        .catch(() => setPackageItems([]));
      fetch('/api/team', getFetchOpts())
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .then((d) => setTeamMembers(d.items || []))
        .catch(() => setTeamMembers([]));
    }
  }, [auth]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      if (res.ok) {
        setAuth(true);
      } else {
        setLoginError(true);
        setLoginPass('');
      }
    } catch {
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setAuth(false);
  }

  function showToast(msg: string, error?: boolean) {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3000);
  }

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const unreadCount = contacts.filter((c) => !c.read).length;
  const revenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((s, b) => s + (b.totalAmount || 0), 0);

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
    if (bookingSearch) {
      const s = bookingSearch.toLowerCase();
      return (
        b.name?.toLowerCase().includes(s) ||
        b.package?.toLowerCase().includes(s) ||
        b.shootType?.toLowerCase().includes(s) ||
        b.ref?.toLowerCase().includes(s) ||
        b.date?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  if (auth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-[var(--muted)] text-sm">Loading…</div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_55%,rgba(46,204,138,0.07)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,204,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(46,204,138,0.03)_1px,transparent_1px)] bg-[length:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_10%,transparent_100%)]" />
        <div className="relative z-10 w-full max-w-[400px] bg-surface border border-[var(--border)] rounded p-12 animate-[fadeUp_0.5s_ease_both]">
          <div className="font-serif text-lg font-light text-white text-center mb-1">
            CineLens<span className="text-green">Studios</span>
          </div>
          <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--muted2)] text-center mb-10">
            Admin Portal
          </div>
          <h2 className="font-serif text-xl font-light text-white mb-1">Welcome back</h2>
          <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed">
            Sign in to manage your bookings, enquiries, and studio settings.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              Incorrect username or password. Please try again.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[0.66rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full bg-black border border-[var(--border)] rounded text-white font-sans text-sm px-4 py-3 outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <div>
              <label className="block text-[0.66rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-black border border-[var(--border)] rounded text-white font-sans text-sm px-4 py-3 outline-none focus:border-[var(--border-focus)]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green text-[#040d08] font-sans text-[0.76rem] font-medium tracking-[0.14em] uppercase py-4 rounded border-none cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[0.72rem] text-[var(--muted2)] mt-6">
            Demo: <code className="text-green bg-[var(--green-faint)] px-1.5 py-0.5 rounded">admin</code> /{' '}
            <code className="text-green bg-[var(--green-faint)] px-1.5 py-0.5 rounded">admin@123</code>
          </p>
          <Link
            href="/"
            className="block text-center text-[0.72rem] tracking-[0.12em] uppercase text-[var(--muted2)] mt-4 no-underline hover:text-[var(--muted)]"
          >
            ← Back to Website
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: 'grid' },
    { id: 'bookings' as const, label: 'Bookings', icon: 'calendar', badge: pendingCount },
    { id: 'enquiries' as const, label: 'Enquiries', icon: 'mail', badge: unreadCount },
    { id: 'portfolio' as const, label: 'Portfolio', icon: 'image' },
    { id: 'packages' as const, label: 'Packages', icon: 'package' },
    { id: 'team' as const, label: 'Team', icon: 'users' },
    { id: 'settings' as const, label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-dark border-r border-[var(--border)] flex flex-col z-50">
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="font-serif text-lg font-light text-white no-underline block">
            CineLens<span className="text-green">Studios</span>
          </Link>
          <div className="text-[0.58rem] tracking-[0.2em] uppercase text-[var(--muted2)] mt-1">
            Admin Dashboard
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="text-[0.58rem] tracking-[0.22em] uppercase text-[var(--muted2)] px-6 py-2">
            Main
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPanel(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left text-sm transition-colors ${
                panel === item.id
                  ? 'text-white bg-[var(--green-faint)] border-l-2 border-l-green'
                  : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon === 'grid' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="1" y="1" width="6" height="6" rx="1" />
                  <rect x="9" y="1" width="6" height="6" rx="1" />
                  <rect x="1" y="9" width="6" height="6" rx="1" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
              )}
              {item.icon === 'calendar' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="2" y="3" width="12" height="11" rx="1" />
                  <path d="M5 3V1M11 3V1M2 7h12" strokeLinecap="round" />
                </svg>
              )}
              {item.icon === 'mail' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" />
                  <path d="M1 4l7 5 7-5" strokeLinecap="round" />
                </svg>
              )}
              {item.icon === 'package' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="2" y="2" width="12" height="12" rx="1" />
                  <path d="M5 8h6M8 5v6" strokeLinecap="round" />
                </svg>
              )}
              {item.icon === 'users' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="5.5" cy="4.5" r="2" />
                  <circle cx="10.5" cy="4.5" r="2" />
                  <path d="M2 12c0-1.5 1.5-2.5 3.5-2.5s3.5 1 3.5 2.5M10 12c0-1.5 1.5-2.5 3.5-2.5s3.5 1 3.5 2.5" strokeLinecap="round" />
                </svg>
              )}
              {item.icon === 'image' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="2" y="2" width="12" height="12" rx="1" />
                  <circle cx="5.5" cy="5.5" r="1.5" />
                  <path d="M2 12l4-4 3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {item.icon === 'settings' && (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="8" cy="8" r="2.5" />
                  <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" strokeLinecap="round" />
                </svg>
              )}
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto text-[0.6rem] font-medium bg-green text-[#040d08] px-2 py-0.5 rounded-full min-w-[18px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-dim flex items-center justify-center text-sm font-medium text-white">
              A
            </div>
            <div>
              <div className="text-sm text-white">Admin</div>
              <div className="text-[0.68rem] text-[var(--muted2)]">Studio Manager</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-transparent border border-[var(--border)] text-[var(--muted)] text-[0.7rem] tracking-[0.12em] uppercase rounded hover:border-red-500/40 hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-black/80 backdrop-blur">
          <h1 className="font-serif text-xl font-light text-white">
            {panel === 'overview' && <>Overview <span className="italic text-green">Dashboard</span></>}
            {panel === 'bookings' && <>Bookings <span className="italic text-green">Manager</span></>}
            {panel === 'enquiries' && <>Contact <span className="italic text-green">Enquiries</span></>}
            {panel === 'portfolio' && <>Portfolio <span className="italic text-green">Images</span></>}
            {panel === 'packages' && <>Packages <span className="italic text-green">Pricing</span></>}
            {panel === 'team' && <>Team <span className="italic text-green">The Crew</span></>}
            {panel === 'settings' && <>Studio <span className="italic text-green">Settings</span></>}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[0.75rem] text-[var(--muted2)]">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-[0.72rem] tracking-[0.12em] uppercase text-green border border-[var(--border-green)] px-4 py-2 rounded no-underline hover:bg-[var(--green-glow)]"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">
          {panel === 'overview' && (
            <div className="animate-[fadeUp_0.3s_ease_both]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-surface border border-[var(--border)] rounded p-6 hover:border-white/10 transition-colors">
                  <div className="text-[0.66rem] tracking-[0.18em] uppercase text-[var(--muted2)] mb-2">
                    Total Bookings
                  </div>
                  <div className="font-serif text-3xl font-light text-green">{bookings.length}</div>
                </div>
                <div className="bg-surface border border-[var(--border)] rounded p-6 hover:border-white/10 transition-colors">
                  <div className="text-[0.66rem] tracking-[0.18em] uppercase text-[var(--muted2)] mb-2">
                    Pending Confirmation
                  </div>
                  <div className="font-serif text-3xl font-light text-[var(--amber)]">{pendingCount}</div>
                </div>
                <div className="bg-surface border border-[var(--border)] rounded p-6 hover:border-white/10 transition-colors">
                  <div className="text-[0.66rem] tracking-[0.18em] uppercase text-[var(--muted2)] mb-2">
                    Confirmed
                  </div>
                  <div className="font-serif text-3xl font-light text-[var(--blue)]">
                    {bookings.filter((b) => b.status === 'confirmed').length}
                  </div>
                </div>
                <div className="bg-surface border border-[var(--border)] rounded p-6 hover:border-white/10 transition-colors">
                  <div className="text-[0.66rem] tracking-[0.18em] uppercase text-[var(--muted2)] mb-2">
                    Revenue (Est.)
                  </div>
                  <div className="font-serif text-3xl font-light text-white">
                    ₹{(revenue / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface border border-[var(--border)] rounded overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
                    <span className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)]">
                      Recent Bookings
                    </span>
                    <button
                      onClick={() => setPanel('bookings')}
                      className="text-[0.7rem] tracking-[0.1em] uppercase text-green hover:opacity-80"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {bookings.slice(0, 6).map((b, i) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setModalBooking(b);
                          setModalStatus(b.status);
                        }}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {initials(b.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{b.name}</div>
                          <div className="text-[0.72rem] text-[var(--muted2)]">
                            {b.package} · {formatDate(b.date)}
                          </div>
                        </div>
                        <span
                          className={`text-[0.6rem] tracking-[0.12em] uppercase px-2 py-1 rounded ${
                            b.status === 'pending'
                              ? 'bg-[var(--amber)]/15 text-[var(--amber)] border border-[var(--amber)]/25'
                              : b.status === 'confirmed'
                              ? 'bg-green/12 text-green border border-green/25'
                              : b.status === 'completed'
                              ? 'bg-[var(--blue)]/12 text-[var(--blue)] border border-[var(--blue)]/25'
                              : 'bg-red/12 text-red border border-red/25'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="px-6 py-12 text-center text-[var(--muted2)] text-sm">
                        No bookings yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-surface border border-[var(--border)] rounded overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--border)]">
                    <span className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)]">
                      Activity Feed
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {bookings.slice(0, 5).map((b, i) => (
                      <div key={b.id} className="flex gap-0.5 px-6 py-3">
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        />
                        <div>
                          <div className="text-[0.8rem] text-[var(--muted)]">
                            <strong className="text-white font-normal">{b.name}</strong> — {b.package} on{' '}
                            {formatDate(b.date)}
                          </div>
                          <div className="text-[0.7rem] text-[var(--muted2)] mt-0.5">
                            {new Date(b.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="px-6 py-8 text-center text-[var(--muted2)] text-sm">
                        No recent activity.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'bookings' && (
            <div className="animate-[fadeUp_0.3s_ease_both]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setBookingFilter(f)}
                      className={`text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded border transition-colors ${
                        bookingFilter === f
                          ? 'border-[var(--border-green)] text-green bg-[var(--green-faint)]'
                          : 'border-[var(--border)] text-[var(--muted)] hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-surface border border-[var(--border)] rounded px-3 py-2">
                  <input
                    type="text"
                    placeholder="Search by name, package, date…"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-white text-sm w-48 placeholder:text-[var(--muted2)]"
                  />
                </div>
              </div>

              <div className="bg-surface border border-[var(--border)] rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-dark text-[var(--muted2)] text-[0.62rem] tracking-[0.15em] uppercase">
                        <th className="px-4 py-3">Ref #</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Package</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b, i) => (
                        <tr
                          key={b.id}
                          className="border-t border-[var(--border)] hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-[0.74rem] text-[var(--muted2)]">{b.ref}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[0.62rem] font-medium text-white"
                                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                              >
                                {initials(b.name)}
                              </div>
                              <div>
                                <div className="text-sm text-white">{b.name}</div>
                                <div className="text-[0.72rem] text-[var(--muted2)]">{b.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--muted)]">{b.package}</td>
                          <td className="px-4 py-3 text-[0.72rem] text-[var(--muted2)]">{b.shootType}</td>
                          <td className="px-4 py-3 text-sm text-[var(--muted)]">
                            {formatDate(b.date)}
                            {b.time && <br />}
                            {b.time && <span className="text-[0.72rem] text-[var(--muted2)]">{b.time}</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--muted)]">
                            ₹{(b.totalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[0.6rem] tracking-[0.12em] uppercase px-2 py-1 rounded ${
                                b.status === 'pending'
                                  ? 'bg-[var(--amber)]/15 text-[var(--amber)] border border-[var(--amber)]/25'
                                  : b.status === 'confirmed'
                                  ? 'bg-green/12 text-green border border-green/25'
                                  : b.status === 'completed'
                                  ? 'bg-[var(--blue)]/12 text-[var(--blue)] border border-[var(--blue)]/25'
                                  : 'bg-red/12 text-red border border-red/25'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setModalBooking(b);
                                  setModalStatus(b.status);
                                }}
                                className="w-7 h-7 rounded border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-[var(--border-green)] hover:text-green hover:bg-[var(--green-faint)]"
                                title="View"
                              >
                                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
                                  <circle cx="6" cy="6" r="4" />
                                  <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                                </svg>
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm('Delete this booking?')) return;
                                  const res = await fetch(`/api/admin/bookings/${b.id}`, {
                                    method: 'DELETE',
                                    credentials: 'include',
                                  });
                                  if (res.ok) {
                                    setBookings((prev) => prev.filter((x) => x.id !== b.id));
                                    showToast('Booking deleted');
                                  }
                                }}
                                className="w-7 h-7 rounded border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10"
                                title="Delete"
                              >
                                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
                                  <path d="M1.5 3h9M4.5 3V2h3v1M5 5.5v3M7 5.5v3M2.5 3l.5 7h6l.5-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-[var(--muted2)] text-sm">
                            No bookings match your filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-[var(--border)] bg-dark text-[0.74rem] text-[var(--muted2)]">
                  Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}

          {panel === 'enquiries' && (
            <div className="animate-[fadeUp_0.3s_ease_both] space-y-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className={`bg-surface border rounded p-6 hover:border-white/10 transition-colors ${
                    !c.read ? 'border-l-2 border-l-green' : 'border-[var(--border)]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <div className="text-base text-white">
                        {c.firstName} {c.lastName}
                        {!c.read && (
                          <span className="inline-block w-2 h-2 rounded-full bg-green ml-2 align-middle" />
                        )}
                      </div>
                      <div className="text-[0.75rem] text-[var(--muted2)] mt-0.5">{c.email}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[0.72rem] text-[var(--muted2)]">{formatDate(c.createdAt)}</div>
                      <div className="text-[0.64rem] tracking-[0.12em] uppercase text-green mt-1">{c.subject || 'General'}</div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">{c.message}</p>
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`mailto:${c.email}?subject=Re: ${c.subject || 'Enquiry'} — CineLensStudios`}
                      className="text-[0.68rem] tracking-[0.12em] uppercase text-green border border-[var(--border-green)] px-3 py-1.5 rounded bg-[var(--green-faint)] no-underline hover:opacity-90"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/admin/contacts/${c.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'include',
                          body: JSON.stringify({ read: true }),
                        });
                        if (res.ok) {
                          setContacts((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, read: true } : x))
                          );
                        }
                      }}
                      className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] border border-[var(--border)] px-3 py-1.5 rounded hover:border-[var(--border-green)] hover:text-green"
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this enquiry?')) return;
                        const res = await fetch(`/api/admin/contacts/${c.id}`, {
                          method: 'DELETE',
                          credentials: 'include',
                        });
                        if (res.ok) {
                          setContacts((prev) => prev.filter((x) => x.id !== c.id));
                          showToast('Enquiry deleted');
                        }
                      }}
                      className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] border border-[var(--border)] px-3 py-1.5 rounded hover:border-red-500/40 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-16 text-[var(--muted2)] text-sm">No enquiries yet.</div>
              )}
            </div>
          )}

          {panel === 'packages' && (
            <div className="animate-[fadeUp_0.3s_ease_both] space-y-8">
              <div className="bg-surface border border-[var(--border)] rounded p-6">
                <div className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-4">
                  Add New Package
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Name</label>
                    <input
                      type="text"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Essentials"
                      className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Duration</label>
                    <input
                      type="text"
                      value={newPackage.duration}
                      onChange={(e) => setNewPackage((p) => ({ ...p, duration: e.target.value }))}
                      placeholder="e.g. 2 Hours · 1 Location"
                      className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage((p) => ({ ...p, price: e.target.value }))}
                      placeholder="8999"
                      className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Badge (optional)</label>
                    <input
                      type="text"
                      value={newPackage.badge}
                      onChange={(e) => setNewPackage((p) => ({ ...p, badge: e.target.value }))}
                      placeholder="e.g. Most Popular"
                      className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">
                    Features (one per line)
                  </label>
                  <textarea
                    value={newPackage.features}
                    onChange={(e) => setNewPackage((p) => ({ ...p, features: e.target.value }))}
                    placeholder={'Up to 60 edited photos\n1 outfit change\nOnline gallery delivery'}
                    rows={4}
                    className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)] resize-y"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={newPackage.featured}
                      onChange={(e) => setNewPackage((p) => ({ ...p, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-[var(--border)]"
                    />
                    Featured
                  </label>
                  <button
                    onClick={async () => {
                      if (!newPackage.name || !newPackage.duration || !newPackage.price) {
                        showToast('Fill name, duration, and price', true);
                        return;
                      }
                      const res = await fetch('/api/packages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          name: newPackage.name,
                          duration: newPackage.duration,
                          price: Number(newPackage.price),
                          billingNote: newPackage.billingNote,
                          featured: newPackage.featured,
                          badge: newPackage.badge || undefined,
                          features: newPackage.features.split('\n').map((f) => f.trim()).filter(Boolean),
                        }),
                      });
                      if (res.ok) {
                        const item = await res.json();
                        setPackageItems((prev) => [...prev, item]);
                        setNewPackage({ name: '', duration: '', price: '', billingNote: 'Per session · Fully edited', featured: false, badge: '', features: '' });
                        showToast('Package added');
                      } else {
                        showToast('Failed to add package', true);
                      }
                    }}
                    className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                  >
                    Add Package
                  </button>
                </div>
              </div>

              <div className="bg-surface border border-[var(--border)] rounded overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <span className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)]">
                    Current Packages ({packageItems.length})
                  </span>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {packageItems.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:bg-white/5"
                    >
                      <div>
                        <div className="font-serif text-lg text-white">{pkg.name}</div>
                        <div className="text-[0.72rem] text-[var(--muted)] mt-0.5">{pkg.duration}</div>
                        <div className="text-green font-serif text-xl mt-1">₹{pkg.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="flex gap-2">
                        {/^[a-f0-9]{24}$/i.test(pkg.id) && (
                          <>
                            <button
                              onClick={() => setEditingPackage(pkg)}
                              className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted)] border border-[var(--border)] px-4 py-2 rounded hover:border-[var(--border-green)] hover:text-green"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Delete this package?')) return;
                                const res = await fetch(`/api/packages/${pkg.id}`, {
                                  method: 'DELETE',
                                  credentials: 'include',
                                });
                                if (res.ok) {
                                  setPackageItems((prev) => prev.filter((x) => x.id !== pkg.id));
                                  showToast('Package deleted');
                                }
                              }}
                          className="text-[0.68rem] tracking-[0.12em] uppercase text-red-400 border border-red-500/40 px-4 py-2 rounded hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                          </>
                        )}
                        {!/^[a-f0-9]{24}$/i.test(pkg.id) && (
                          <span className="text-[0.72rem] text-[var(--muted)] italic">From site-settings.json (read-only)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {packageItems.length === 0 && (
                  <div className="py-16 text-center text-[var(--muted2)] text-sm">
                    No packages in database. Add one above, or the site will use packages from site-settings.json.
                  </div>
                )}
              </div>

              {editingPackage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setEditingPackage(null)}>
                  <div className="bg-surface border border-[var(--border)] rounded-lg w-[92vw] max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-serif text-xl text-white mb-4">Edit Package</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Name</label>
                        <input
                          type="text"
                          value={editingPackage.name}
                          onChange={(e) => setEditingPackage((p) => p ? { ...p, name: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Duration</label>
                        <input
                          type="text"
                          value={editingPackage.duration}
                          onChange={(e) => setEditingPackage((p) => p ? { ...p, duration: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Price (₹)</label>
                        <input
                          type="number"
                          value={editingPackage.price}
                          onChange={(e) => setEditingPackage((p) => p ? { ...p, price: Number(e.target.value) } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Features (one per line)</label>
                        <textarea
                          value={editingPackage.features.join('\n')}
                          onChange={(e) => setEditingPackage((p) => p ? { ...p, features: e.target.value.split('\n').map((f) => f.trim()).filter(Boolean) } : null)}
                          rows={4}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)] resize-y"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!editingPackage) return;
                            const res = await fetch(`/api/packages/${editingPackage.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                name: editingPackage.name,
                                duration: editingPackage.duration,
                                price: editingPackage.price,
                                features: editingPackage.features,
                              }),
                            });
                            if (res.ok) {
                              const updated = await res.json();
                              setPackageItems((prev) => prev.map((p) => (p.id === editingPackage.id ? updated : p)));
                              setEditingPackage(null);
                              showToast('Package updated');
                            }
                          }}
                          className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPackage(null)}
                          className="border border-[var(--border)] text-[var(--muted)] text-[0.72rem] px-6 py-2.5 rounded hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {panel === 'team' && (
            <div className="animate-[fadeUp_0.3s_ease_both] space-y-8">
              <div className="bg-surface border border-[var(--border)] rounded p-6">
                <div className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-4">
                  Add New Team Member
                </div>
                <p className="text-sm text-[var(--muted2)] mb-4">
                  Upload a photo to Cloudinary, then fill in the details. Team members appear on the About page.
                </p>
                <div className="flex flex-wrap gap-4 items-end mb-4">
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">
                      Photo
                    </label>
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'cinelens'}
                      onSuccess={(result) => {
                        const info = result.info as { public_id?: string };
                        if (info?.public_id) setNewTeamMember((p) => ({ ...p, imagePublicId: info.public_id as string }));
                        showToast('Photo uploaded');
                      }}
                      options={{
                        folder: 'cinelens/team',
                        maxFiles: 1,
                        sources: ['local', 'url'],
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                        >
                          Upload Photo
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Name</label>
                    <input
                      type="text"
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Pratham Khamkar"
                      className="bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 w-48 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Role</label>
                    <input
                      type="text"
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember((p) => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Lead Photographer"
                      className="bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 w-48 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Badge</label>
                    <input
                      type="text"
                      value={newTeamMember.badge}
                      onChange={(e) => setNewTeamMember((p) => ({ ...p, badge: e.target.value }))}
                      placeholder="e.g. Founder"
                      className="bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 w-36 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Bio</label>
                  <textarea
                    value={newTeamMember.bio}
                    onChange={(e) => setNewTeamMember((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Short bio about the team member..."
                    rows={3}
                    className="w-full max-w-xl bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)] resize-y"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTeamMember.tags}
                    onChange={(e) => setNewTeamMember((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="e.g. Weddings, Portraits, Film"
                    className="w-full max-w-xl bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!newTeamMember.name || !newTeamMember.role || !newTeamMember.badge || !newTeamMember.bio) {
                      showToast('Fill name, role, badge, and bio', true);
                      return;
                    }
                    const res = await fetch('/api/team', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        name: newTeamMember.name,
                        role: newTeamMember.role,
                        badge: newTeamMember.badge,
                        bio: newTeamMember.bio,
                        tags: newTeamMember.tags.split(',').map((t) => t.trim()).filter(Boolean),
                        imagePublicId: newTeamMember.imagePublicId || undefined,
                      }),
                    });
                    if (res.ok) {
                      const item = await res.json();
                      setTeamMembers((prev) => [...prev, item]);
                      setNewTeamMember({ name: '', role: '', badge: '', bio: '', tags: '', imagePublicId: '' });
                      showToast('Team member added');
                    } else {
                      showToast('Failed to add team member', true);
                    }
                  }}
                  className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                >
                  Add Team Member
                </button>
                {newTeamMember.imagePublicId && (
                  <span className="ml-4 text-[0.72rem] text-green">
                    Photo ready: <code className="bg-[var(--green-faint)] px-1 rounded">{newTeamMember.imagePublicId}</code>
                  </span>
                )}
              </div>

              <div className="bg-surface border border-[var(--border)] rounded overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <span className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)]">
                    Current Team ({teamMembers.length})
                  </span>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex gap-6 p-6 hover:bg-white/5 items-center">
                      <div className="w-20 h-24 rounded overflow-hidden bg-[var(--card-bg)] shrink-0">
                        {member.imagePublicId ? (
                          <CldImage
                            src={member.imagePublicId}
                            width={80}
                            height={96}
                            crop="fill"
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--muted2)] text-xs">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-lg text-white">{member.name}</div>
                        <div className="text-[0.72rem] text-green">{member.role}</div>
                        <div className="text-[0.72rem] text-[var(--muted)] mt-0.5">{member.badge}</div>
                        <p className="text-sm text-[var(--muted2)] mt-2 line-clamp-2">{member.bio}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.tags.map((t, j) => (
                            <span key={j} className="text-[0.62rem] text-[var(--muted2)] border border-[var(--border)] px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {/^[a-f0-9]{24}$/i.test(member.id) && (
                          <>
                            <button
                              onClick={() => setEditingTeamMember(member)}
                              className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted)] border border-[var(--border)] px-4 py-2 rounded hover:border-[var(--border-green)] hover:text-green"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Remove this team member?')) return;
                                const res = await fetch(`/api/team/${member.id}`, {
                                  method: 'DELETE',
                                  credentials: 'include',
                                });
                                if (res.ok) {
                                  setTeamMembers((prev) => prev.filter((x) => x.id !== member.id));
                                  showToast('Team member removed');
                                }
                              }}
                              className="text-[0.68rem] tracking-[0.12em] uppercase text-red-400 border border-red-500/40 px-4 py-2 rounded hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {!/^[a-f0-9]{24}$/i.test(member.id) && (
                          <span className="text-[0.72rem] text-[var(--muted)] italic">From site-settings.json (read-only)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {teamMembers.length === 0 && (
                  <div className="py-16 text-center text-[var(--muted2)] text-sm">
                    No team members in database. Add one above, or the site will use team from site-settings.json.
                  </div>
                )}
              </div>

              {editingTeamMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setEditingTeamMember(null)}>
                  <div className="bg-surface border border-[var(--border)] rounded-lg w-[92vw] max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-serif text-xl text-white mb-4">Edit Team Member</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Photo</label>
                        <div className="flex gap-2 items-center">
                          <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'cinelens'}
                            onSuccess={(result) => {
                              const info = result.info as { public_id?: string };
                              if (info?.public_id) setEditingTeamMember((p) => p ? { ...p, imagePublicId: info.public_id } : null);
                              showToast('Photo updated');
                            }}
                            options={{ folder: 'cinelens/team', maxFiles: 1, sources: ['local', 'url'] }}
                          >
                            {({ open }) => (
                              <button type="button" onClick={() => open()} className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-4 py-2 rounded border-none cursor-pointer hover:opacity-90">
                                {editingTeamMember.imagePublicId ? 'Change Photo' : 'Upload Photo'}
                              </button>
                            )}
                          </CldUploadWidget>
                          {editingTeamMember.imagePublicId && (
                            <button
                              type="button"
                              onClick={() => setEditingTeamMember((p) => p ? { ...p, imagePublicId: '' } : null)}
                              className="text-[0.72rem] text-red-400 hover:text-red-300"
                            >
                              Remove photo
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Name</label>
                        <input
                          type="text"
                          value={editingTeamMember.name}
                          onChange={(e) => setEditingTeamMember((p) => p ? { ...p, name: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Role</label>
                        <input
                          type="text"
                          value={editingTeamMember.role}
                          onChange={(e) => setEditingTeamMember((p) => p ? { ...p, role: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Badge</label>
                        <input
                          type="text"
                          value={editingTeamMember.badge}
                          onChange={(e) => setEditingTeamMember((p) => p ? { ...p, badge: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Bio</label>
                        <textarea
                          value={editingTeamMember.bio}
                          onChange={(e) => setEditingTeamMember((p) => p ? { ...p, bio: e.target.value } : null)}
                          rows={3}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)] resize-y"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={editingTeamMember.tags.join(', ')}
                          onChange={(e) => setEditingTeamMember((p) => p ? { ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!editingTeamMember) return;
                            const res = await fetch(`/api/team/${editingTeamMember.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                name: editingTeamMember.name,
                                role: editingTeamMember.role,
                                badge: editingTeamMember.badge,
                                bio: editingTeamMember.bio,
                                tags: editingTeamMember.tags,
                                imagePublicId: editingTeamMember.imagePublicId,
                              }),
                            });
                            if (res.ok) {
                              const updated = await res.json();
                              setTeamMembers((prev) => prev.map((m) => (m.id === editingTeamMember.id ? updated : m)));
                              setEditingTeamMember(null);
                              showToast('Team member updated');
                            }
                          }}
                          className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTeamMember(null)}
                          className="border border-[var(--border)] text-[var(--muted)] text-[0.72rem] px-6 py-2.5 rounded hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {panel === 'portfolio' && (
            <div className="animate-[fadeUp_0.3s_ease_both] space-y-8">
              <div className="bg-surface border border-[var(--border)] rounded p-6">
                <div className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-4">
                  Add New Portfolio Item
                </div>
                <p className="text-sm text-[var(--muted2)] mb-4">
                  Upload an image to Cloudinary, then add the title and category. Check &quot;Featured&quot; to show on the homepage.
                </p>
                <div className="flex flex-wrap gap-4 items-end mb-4">
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">
                      Upload Image
                    </label>
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'cinelens'}
                      onSuccess={(result) => {
                        const info = result.info as { public_id?: string };
                        if (info?.public_id) setNewItemPublicId(info.public_id);
                        showToast('Image uploaded');
                      }}
                      options={{
                        folder: 'cinelens/portfolio',
                        maxFiles: 1,
                        sources: ['local', 'url'],
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                        >
                          Upload to Cloudinary
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder="e.g. Priya & Arjun"
                      className="bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 w-48 outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">
                      Category
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 w-40 outline-none focus:border-[var(--border-focus)]"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Couple">Couple</option>
                      <option value="Professional">Professional</option>
                      <option value="Events">Events</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Maternity">Maternity</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={newItemFeatured}
                      onChange={(e) => setNewItemFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--border)]"
                    />
                    Featured (show on homepage)
                  </label>
                  <button
                    onClick={async () => {
                      if (!newItemTitle || !newItemPublicId) {
                        showToast('Add title and upload an image first', true);
                        return;
                      }
                      const res = await fetch('/api/portfolio', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                          category: newItemCategory,
                          title: newItemTitle,
                          imagePublicId: newItemPublicId,
                          featured: newItemFeatured,
                        }),
                      });
                      if (res.ok) {
                        const item = await res.json();
                        setPortfolioItems((prev) => [...prev, item]);
                        setNewItemTitle('');
                        setNewItemPublicId('');
                        setNewItemFeatured(false);
                        showToast('Portfolio item added');
                      } else {
                        showToast('Failed to add item', true);
                      }
                    }}
                    className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                  >
                    Add to Portfolio
                  </button>
                </div>
                {newItemPublicId && (
                  <p className="text-[0.72rem] text-green">
                    Image ready: <code className="bg-[var(--green-faint)] px-1 rounded">{newItemPublicId}</code>
                  </p>
                )}
              </div>

              <div className="bg-surface border border-[var(--border)] rounded overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                  <span className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)]">
                    Current Portfolio ({portfolioItems.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-[4/5] rounded overflow-hidden border border-[var(--border)]"
                    >
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!/^[a-f0-9]{24}$/i.test(item.id)) return;
                          const next = !(item.featured ?? false);
                          const res = await fetch(`/api/portfolio/${item.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ featured: next }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setPortfolioItems((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
                            showToast(next ? 'Added to homepage' : 'Removed from homepage');
                          }
                        }}
                        title={item.featured ? 'Remove from homepage' : 'Add to homepage'}
                        className={`absolute top-2 left-10 z-10 w-7 h-7 rounded flex items-center justify-center transition-opacity ${
                          item.featured ? 'bg-green text-[#040d08] opacity-100' : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                        <CldImage
                          src={item.imagePublicId}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0d1a14] to-[#1a3024]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <div className="text-[0.72rem] text-green">{item.category}</div>
                        <div className="text-sm text-white font-medium">{item.title}</div>
                      </div>
                      {/^[a-f0-9]{24}$/i.test(item.id) && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingPortfolio(item); }}
                          title="Edit"
                          className="absolute top-2 left-2 z-10 w-7 h-7 rounded border border-[var(--border)] bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-green hover:text-green"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!confirm('Delete this item?')) return;
                          const res = await fetch(`/api/portfolio/${item.id}`, {
                            method: 'DELETE',
                            credentials: 'include',
                          });
                          if (res.ok) {
                            setPortfolioItems((prev) => prev.filter((x) => x.id !== item.id));
                            showToast('Item deleted');
                          }
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded border border-red-500/40 bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-medium hover:bg-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {portfolioItems.length === 0 && (
                  <div className="py-16 text-center text-[var(--muted2)] text-sm">
                    No portfolio items yet. Upload an image above to get started.
                  </div>
                )}
              </div>

              {editingPortfolio && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setEditingPortfolio(null)}>
                  <div className="bg-surface border border-[var(--border)] rounded-lg w-[92vw] max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-serif text-xl text-white mb-4">Edit Portfolio Item</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Image</label>
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'cinelens'}
                          onSuccess={(result) => {
                            const info = result.info as { public_id?: string };
                            if (info?.public_id) setEditingPortfolio((p) => p ? { ...p, imagePublicId: info.public_id as string } : null);
                            showToast('Image updated');
                          }}
                          options={{ folder: 'cinelens/portfolio', maxFiles: 1, sources: ['local', 'url'] }}
                        >
                          {({ open }) => (
                            <button type="button" onClick={() => open()} className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-4 py-2 rounded border-none cursor-pointer hover:opacity-90">
                              Change Image
                            </button>
                          )}
                        </CldUploadWidget>
                        {editingPortfolio.imagePublicId && (
                          <span className="ml-2 text-[0.72rem] text-green">✓ Image set</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Title</label>
                        <input
                          type="text"
                          value={editingPortfolio.title}
                          onChange={(e) => setEditingPortfolio((p) => p ? { ...p, title: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2">Category</label>
                        <select
                          value={editingPortfolio.category}
                          onChange={(e) => setEditingPortfolio((p) => p ? { ...p, category: e.target.value } : null)}
                          className="w-full bg-black border border-[var(--border)] rounded text-white text-sm px-4 py-2.5 outline-none focus:border-[var(--border-focus)]"
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Couple">Couple</option>
                          <option value="Professional">Professional</option>
                          <option value="Events">Events</option>
                          <option value="Pre-Wedding">Pre-Wedding</option>
                          <option value="Maternity">Maternity</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--muted)]">
                        <input
                          type="checkbox"
                          checked={editingPortfolio.featured ?? false}
                          onChange={(e) => setEditingPortfolio((p) => p ? { ...p, featured: e.target.checked } : null)}
                          className="w-4 h-4 rounded border-[var(--border)]"
                        />
                        Featured on homepage
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!editingPortfolio) return;
                            const res = await fetch(`/api/portfolio/${editingPortfolio.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                title: editingPortfolio.title,
                                category: editingPortfolio.category,
                                imagePublicId: editingPortfolio.imagePublicId,
                                featured: editingPortfolio.featured ?? false,
                              }),
                            });
                            if (res.ok) {
                              const updated = await res.json();
                              setPortfolioItems((prev) => prev.map((p) => (p.id === editingPortfolio.id ? updated : p)));
                              setEditingPortfolio(null);
                              showToast('Portfolio item updated');
                            }
                          }}
                          className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPortfolio(null)}
                          className="border border-[var(--border)] text-[var(--muted)] text-[0.72rem] px-6 py-2.5 rounded hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {panel === 'settings' && (
            <div className="animate-[fadeUp_0.3s_ease_both] grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-[var(--border)] rounded p-6">
                <div className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-6 pb-3 border-b border-[var(--border)]">
                  Quick Links
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Homepage', href: '/' },
                    { label: 'Portfolio', href: '/portfolio' },
                    { label: 'Packages', href: '/packages' },
                    { label: 'Booking', href: '/booking' },
                    { label: 'Contact', href: '/contact' },
                  ].map(({ label, href }) => (
                    <div key={href} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                      <span className="text-sm text-white">{label}</span>
                      <Link href={href} target="_blank" className="text-[0.74rem] text-green no-underline hover:underline">
                        Open →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-surface border border-[var(--border)] rounded p-6">
                <div className="text-[0.72rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-6 pb-3 border-b border-[var(--border)]">
                  Admin Info
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Configure admin credentials via <code className="text-green bg-[var(--green-faint)] px-1 rounded">ADMIN_USERNAME</code> and{' '}
                  <code className="text-green bg-[var(--green-faint)] px-1 rounded">ADMIN_PASSWORD</code> in your environment.
                </p>
                <p className="text-sm text-[var(--muted)] leading-relaxed mt-4">
                  Set <code className="text-green bg-[var(--green-faint)] px-1 rounded">ADMIN_SECRET</code> for JWT signing in production.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {modalBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setModalBooking(null)}
        >
          <div
            className="bg-surface border border-[var(--border)] rounded-lg w-[92vw] max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-surface border-b border-[var(--border)] px-6 py-4 flex justify-between items-center">
              <h3 className="font-serif text-xl font-light text-white">
                Booking <span className="italic text-green">{modalBooking.ref}</span>
              </h3>
              <button
                onClick={() => setModalBooking(null)}
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="text-[0.62rem] tracking-[0.2em] uppercase text-green mb-3">Client Information</div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Name</span>
                    <span className="text-sm text-white">{modalBooking.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Phone</span>
                    <span className="text-sm text-white">{modalBooking.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Email</span>
                    <span className="text-sm text-white">{modalBooking.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[0.62rem] tracking-[0.2em] uppercase text-green mb-3">Shoot Details</div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Package</span>
                    <span className="text-sm text-white">{modalBooking.package}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Type</span>
                    <span className="text-sm text-white">{modalBooking.shootType || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Date</span>
                    <span className="text-sm text-white">{formatDate(modalBooking.date)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Time</span>
                    <span className="text-sm text-white">{modalBooking.time || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Location</span>
                    <span className="text-sm text-white">{modalBooking.location || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <span className="text-[0.74rem] text-[var(--muted2)]">Add-ons</span>
                    <span className="text-sm text-white">
                      {modalBooking.addons?.length ? modalBooking.addons.join(', ') : '—'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[0.62rem] tracking-[0.2em] uppercase text-green mb-3">Payment</div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[0.74rem] text-[var(--muted2)]">Total</span>
                  <span className="text-lg text-green font-serif">
                    ₹{(modalBooking.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              {modalBooking.message && (
                <div>
                  <div className="text-[0.62rem] tracking-[0.2em] uppercase text-green mb-3">Client Note</div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{modalBooking.message}</p>
                </div>
              )}
              <div>
                <div className="text-[0.62rem] tracking-[0.2em] uppercase text-green mb-3">Update Status</div>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="bg-black border border-[var(--border)] rounded text-white text-sm px-3 py-2 outline-none focus:border-[var(--border-focus)]"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-surface border-t border-[var(--border)] px-6 py-4 flex gap-3 flex-wrap">
              <a
                href={`https://wa.me/${modalBooking.phone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded no-underline hover:opacity-90"
              >
                WhatsApp Client
              </a>
              <a
                href={`mailto:${modalBooking.email}`}
                className="border border-[var(--border)] text-[var(--muted)] text-[0.72rem] tracking-[0.13em] uppercase px-5 py-2.5 rounded no-underline hover:border-white/20 hover:text-white"
              >
                Send Email
              </a>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/admin/bookings/${modalBooking.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ status: modalStatus }),
                  });
                  if (res.ok) {
                    setBookings((prev) =>
                      prev.map((b) => (b.id === modalBooking.id ? { ...b, status: modalStatus } : b))
                    );
                    showToast(`Status set to "${modalStatus}"`);
                  }
                }}
                className="bg-green text-[#040d08] text-[0.72rem] font-medium tracking-[0.13em] uppercase px-6 py-2.5 rounded border-none cursor-pointer hover:opacity-90"
              >
                Save Status
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Delete this booking?')) return;
                  const res = await fetch(`/api/admin/bookings/${modalBooking.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  if (res.ok) {
                    setBookings((prev) => prev.filter((b) => b.id !== modalBooking.id));
                    setModalBooking(null);
                    showToast('Booking deleted');
                  }
                }}
                className="ml-auto border border-red-500/25 text-red-400 text-[0.72rem] tracking-[0.13em] uppercase px-5 py-2.5 rounded cursor-pointer hover:bg-red-500/10"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-5 py-3 rounded border ${
            toast.error ? 'border-red-500/40 bg-red-500/10' : 'border-[var(--border-green)] bg-surface'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${toast.error ? 'bg-red-400' : 'bg-green'}`}
          />
          <span className="text-sm text-white">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
