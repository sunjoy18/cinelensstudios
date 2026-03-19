'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SiteSettings } from '@/lib/content';

const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

// Demo booked dates (format: 'YYYY-M-D')
const BOOKED_DATES = new Set([
  '2026-3-21',
  '2026-3-22',
  '2026-3-28',
  '2026-4-5',
  '2026-4-12',
  '2026-4-19',
  '2026-4-26',
]);

// Demo booked slots per date
const BOOKED_SLOTS: Record<string, string[]> = {
  '2026-3-25': ['10:00 AM', '2:00 PM'],
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

type BookingFormData = {
  package: string;
  packagePrice: number;
  shootType: string;
  date: string | null;
  time: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  location: string;
  referral: string;
  message: string;
  addons: string[];
  agreeTerms: boolean;
};

export function BookingForm({ settings }: { settings: SiteSettings }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const today = useMemo(() => new Date(), []);

  const [calView, setCalView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [form, setForm] = useState<BookingFormData>({
    package: '',
    packagePrice: 0,
    shootType: '',
    date: null,
    time: null,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    location: '',
    referral: '',
    message: '',
    addons: [],
    agreeTerms: false,
  });

  const packages = settings.packages.items;
  const currency = settings.packages.currency;
  const bookingPage = settings.bookingPage as {
    shootTypes?: string[];
    addons?: { id: string; name: string; price: number }[];
    referralOptions?: string[];
  };
  const shootTypes = bookingPage?.shootTypes ?? [
    'Wedding',
    'Pre-Wedding / Engagement',
    'Couple Shoot',
    'Professional / Corporate',
    'Event Coverage',
    'Maternity',
    'Birthday / Milestone',
    'Other',
  ];
  const addons = bookingPage?.addons ?? [
    { id: 'drone', name: 'Drone Aerial Shots', price: 3500 },
    { id: 'printed', name: 'Printed Photo Album', price: 2500 },
    { id: 'reel', name: 'Short Cinematic Reel', price: 4000 },
    { id: 'rush', name: 'Rush Delivery (48 hrs)', price: 1500 },
  ];
  const referralOptions = bookingPage?.referralOptions ?? [
    'Instagram',
    'Google Search',
    'Word of Mouth / Friend',
    'Previous Client',
    'Other',
  ];

  const addonTotal = form.addons.reduce(
    (sum, id) => sum + (addons.find((a) => a.id === id)?.price ?? 0),
    0
  );
  const total = form.packagePrice + addonTotal;

  function updateForm(partial: Partial<BookingFormData>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function goStep(n: number) {
    setStep(n);
    if (n === 2) {
      setForm((prev) => ({ ...prev, date: null, time: null }));
    }
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  function selectDate(d: number, key: string) {
    updateForm({ date: key, time: null });
  }

  function changeMonth(dir: number) {
    setCalView((prev) => {
      let { year, month } = prev;
      month += dir;
      if (month < 0) {
        month = 11;
        year--;
      }
      if (month > 11) {
        month = 0;
        year++;
      }
      if (
        year < today.getFullYear() ||
        (year === today.getFullYear() && month < today.getMonth())
      ) {
        return { year: today.getFullYear(), month: today.getMonth() };
      }
      return { year, month };
    });
    updateForm({ date: null, time: null });
  }

  function toggleAddon(id: string) {
    setForm((prev) => ({
      ...prev,
      addons: prev.addons.includes(id)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id],
    }));
  }

  const calendarDays = useMemo(() => {
    const { year, month } = calView;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { day: number | null; key: string | null; isToday: boolean; isPast: boolean; isBooked: boolean }[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, key: null, isToday: false, isPast: false, isBooked: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${month + 1}-${d}`;
      const cellDate = new Date(year, month, d);
      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      const isPast =
        cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isBooked = BOOKED_DATES.has(key);
      cells.push({ day: d, key, isToday, isPast, isBooked });
    }
    return cells;
  }, [calView, today]);

  const bookedForDate = form.date ? BOOKED_SLOTS[form.date] ?? [] : [];

  async function handleSubmit() {
    if (!form.agreeTerms) {
      alert('Please agree to the booking terms to continue.');
      return;
    }

    const name = `${form.firstName} ${form.lastName}`.trim();
    if (!name || !form.email || !form.package || !form.date) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const ref = `CLS-${Math.floor(Math.random() * 9000 + 1000)}`;
      const [y, m, d] = form.date!.split('-');
      const dateStr = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: form.email,
          phone: form.phone,
          package: form.package,
          shootType: form.shootType,
          date: dateStr,
          time: form.time,
          location: form.location,
          referral: form.referral,
          message: form.message,
          addons: form.addons,
          totalAmount: total > 0 ? total : undefined,
          ref,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingRef(data.ref || ref);
        setSuccess(true);
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        throw new Error('Failed');
      }
    } catch {
      alert('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-surface border border-[var(--border)] rounded-sm text-white font-sans text-sm font-light px-4 py-3 outline-none focus:border-[var(--border-focus)] focus:bg-[rgba(46,204,138,0.03)] disabled:opacity-70 transition-colors';
  const labelClass =
    'block text-[0.68rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-2';

  if (success) {
    return (
      <div className="max-w-[600px] mx-auto p-8 sm:p-12 md:p-16 text-center">
        <div className="w-[72px] h-[72px] rounded-full border border-[var(--border-green)] bg-[var(--green-faint)] flex items-center justify-center mx-auto mb-8">
          <svg
            viewBox="0 0 32 32"
            className="w-8 h-8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="15" stroke="#2ecc8a" strokeWidth="1" />
            <path
              d="M9 16.5l5 5 9-10"
              stroke="#2ecc8a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-serif text-[2.2rem] font-light text-white mb-4">
          Booking <span className="italic text-green">Received!</span>
        </h2>
        <p className="text-[var(--muted)] leading-relaxed mb-8 max-w-[400px] mx-auto">
          Thank you for trusting CineLensStudios with your story. We&apos;ll reach
          out within 24 hours to confirm your session and discuss advance payment.
        </p>
        <div className="font-serif text-base text-green border border-[var(--border-green)] py-2.5 px-6 rounded-sm inline-block tracking-[0.1em] mb-8">
          REF #{bookingRef}
        </div>
        <Link
          href="/"
          className="text-[0.78rem] tracking-[0.12em] uppercase text-[var(--muted)] no-underline hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Steps bar */}
      <div className="sticky top-[57px] sm:top-[65px] z-50 bg-dark border-b border-[var(--border)] px-4 sm:px-6 md:px-16">
        <div className="flex gap-0 max-w-[900px] overflow-x-auto">
          {[
            { num: 1, label: 'Package' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Your Details' },
            { num: 4, label: 'Confirm' },
          ].map(({ num, label }) => (
            <button
              key={num}
              type="button"
              onClick={() => goStep(num)}
              className={`
                flex items-center gap-2.5 py-4 pr-6 pl-6 md:pl-0 first:pl-0
                text-[0.74rem] tracking-[0.12em] uppercase whitespace-nowrap
                border-none bg-transparent cursor-pointer transition-colors
                relative
                ${num > 1 ? 'border-l border-[var(--border)] pl-6' : ''}
                ${step === num ? 'text-white' : step > num ? 'text-green' : 'text-[var(--muted2)]'}
              `}
            >
              <span
                className={`
                  w-[22px] h-[22px] rounded-full border flex items-center justify-center
                  text-[0.65rem] font-medium shrink-0
                  ${step >= num ? 'bg-green border-green text-[#040d08]' : 'border-current'}
                `}
              >
                {num}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-16 py-12 sm:py-16 pb-20 sm:pb-24 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
        <div className="form-area">
          {/* Step 1: Package */}
          {step === 1 && (
            <div className="animate-[fadeUp_0.4s_ease_both]">
              <h2 className="font-serif text-[1.6rem] font-light text-white mb-2">
                Choose Your <span className="italic text-green">Package</span>
              </h2>
              <p className="text-sm text-[var(--muted)] mb-10 leading-relaxed">
                Select the shoot package that fits your vision. All packages include
                post-production editing and private gallery delivery.
              </p>

              <div className="space-y-4 mb-8">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() =>
                      updateForm({ package: pkg.name, packagePrice: pkg.price })
                    }
                    className={`
                      w-full p-5 rounded-sm border border-[var(--border)] cursor-pointer
                      flex justify-between items-center text-left transition-all
                      relative overflow-hidden
                      ${form.package === pkg.name
                        ? 'border-[var(--border-green)] bg-[var(--green-faint)] border-l-4 border-l-green'
                        : 'hover:border-white/20'
                      }
                    `}
                  >
                    <div>
                      <div className="font-serif text-lg font-light text-white">
                        {pkg.name}
                      </div>
                      <div className="text-[0.72rem] tracking-[0.12em] uppercase text-[var(--muted)] mt-1">
                        {pkg.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {pkg.featured && (
                        <span className="text-[0.65rem] tracking-[0.12em] uppercase text-[#040d08] bg-green px-2 py-1 rounded-sm">
                          Popular
                        </span>
                      )}
                      <span className="font-serif text-xl text-green">
                        {currency}
                        {pkg.price.toLocaleString('en-IN')}
                      </span>
                      <div
                        className={`
                          w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0
                          ${form.package === pkg.name ? 'border-green bg-green' : 'border-[var(--border)]'}
                        `}
                      >
                        {form.package === pkg.name && (
                          <span className="w-2 h-2 rounded-full bg-[#040d08]" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className={labelClass}>Shoot Type</label>
                <select
                  value={form.shootType}
                  onChange={(e) => updateForm({ shootType: e.target.value })}
                  className={`${inputClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%276%27 fill=%27none%27%3E%3Cpath d=%27M1 1l4 4 4-4%27 stroke=%27%232ecc8a%27 stroke-width=%271.5%27 stroke-linecap=%27round%27/%3E%3C/svg%3E')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                >
                  <option value="">Select a category…</option>
                  {shootTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => goStep(2)}
                  className="flex-1 bg-green text-[#040d08] font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase py-4 px-8 rounded-sm border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Continue to Date &amp; Time →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="animate-[fadeUp_0.4s_ease_both]">
              <h2 className="font-serif text-[1.6rem] font-light text-white mb-2">
                Pick a <span className="italic text-green">Date</span>
              </h2>
              <p className="text-sm text-[var(--muted)] mb-10 leading-relaxed">
                Select your preferred shoot date. Dates marked are already booked. We
                recommend booking at least 2 weeks in advance.
              </p>

              <div className="bg-surface border border-[var(--border)] rounded-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-serif text-lg font-light text-white">
                    {MONTHS[calView.month]} {calView.year}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      disabled={
                        calView.year === today.getFullYear() &&
                        calView.month <= today.getMonth()
                      }
                      className="w-8 h-8 rounded border border-[var(--border)] bg-transparent text-[var(--muted)] flex items-center justify-center text-sm hover:border-[var(--border-green)] hover:text-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      className="w-8 h-8 rounded border border-[var(--border)] bg-transparent text-[var(--muted)] flex items-center justify-center text-sm hover:border-[var(--border-green)] hover:text-green transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-0.5 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div
                      key={d}
                      className="text-[0.65rem] tracking-[0.14em] uppercase text-[var(--muted2)] text-center py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cell, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        !cell.isPast &&
                        !cell.isBooked &&
                        cell.key &&
                        selectDate(cell.day!, cell.key)
                      }
                      className={`
                        aspect-square flex items-center justify-center text-[0.82rem] rounded-sm cursor-pointer transition-all
                        ${!cell.day ? 'cursor-default' : ''}
                        ${cell.isPast ? 'text-[var(--muted2)] opacity-35 cursor-not-allowed' : ''}
                        ${cell.isBooked ? 'text-[var(--muted2)] line-through opacity-40 cursor-not-allowed' : ''}
                        ${!cell.isPast && !cell.isBooked && cell.day ? 'text-[var(--muted)] hover:bg-[var(--green-faint)] hover:text-white' : ''}
                        ${form.date === cell.key ? 'bg-green text-[#040d08] font-medium' : ''}
                        ${cell.isToday ? 'relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-green' : ''}
                        ${form.date === cell.key && cell.isToday ? 'after:bg-[#040d08]' : ''}
                      `}
                    >
                      {cell.day}
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 mt-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green" />
                    <span className="text-[0.68rem] tracking-[0.1em] uppercase text-[var(--muted2)]">
                      Selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <span className="text-[0.68rem] tracking-[0.1em] uppercase text-[var(--muted2)]">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <span className="text-[0.68rem] tracking-[0.1em] uppercase text-[var(--muted2)]">
                      Booked
                    </span>
                  </div>
                </div>
              </div>

              {form.date && (
                <div className="mb-8">
                  <div className="text-[0.72rem] tracking-[0.14em] uppercase text-[var(--muted)] mb-3">
                    Preferred Start Time
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedForDate.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() =>
                            !isBooked && updateForm({ time: slot })
                          }
                          className={`
                            py-2.5 px-2 text-center text-[0.8rem] rounded-sm border transition-all
                            ${isBooked
                              ? 'opacity-30 cursor-not-allowed line-through text-[var(--muted)] border-[var(--border)]'
                              : form.time === slot
                              ? 'bg-[var(--green-faint)] border-[var(--border-green)] text-green'
                              : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-green)] hover:text-white'
                            }
                          `}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => goStep(1)}
                  className="bg-transparent text-[var(--muted)] font-sans text-[0.76rem] tracking-[0.12em] uppercase py-4 px-6 rounded-sm border border-[var(--border)] cursor-pointer hover:border-white/20 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goStep(3)}
                  className="flex-1 bg-green text-[#040d08] font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase py-4 px-8 rounded-sm border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="animate-[fadeUp_0.4s_ease_both]">
              <h2 className="font-serif text-[1.6rem] font-light text-white mb-2">
                Your <span className="italic text-green">Details</span>
              </h2>
              <p className="text-sm text-[var(--muted)] mb-10 leading-relaxed">
                Tell us about yourself so we can prepare the perfect shoot experience
                for you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateForm({ firstName: e.target.value })}
                    placeholder="Arjun"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateForm({ lastName: e.target.value })}
                    placeholder="Sharma"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm({ phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    placeholder="you@example.com"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass}>
                  Shoot Location / City *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm({ location: e.target.value })}
                  placeholder="e.g. Bandra, Mumbai"
                  disabled={loading}
                  className={inputClass}
                />
                <p className="text-[0.72rem] text-[var(--muted2)] mt-1.5 leading-relaxed">
                  Mention a specific venue or general area. We&apos;ll discuss exact
                  location details over WhatsApp.
                </p>
              </div>

              <div className="mb-5">
                <label className={labelClass}>How did you hear about us?</label>
                <select
                  value={form.referral}
                  onChange={(e) => updateForm({ referral: e.target.value })}
                  className={`${inputClass} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%276%27 fill=%27none%27%3E%3Cpath d=%27M1 1l4 4 4-4%27 stroke=%27%232ecc8a%27 stroke-width=%271.5%27 stroke-linecap=%27round%27/%3E%3C/svg%3E')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                >
                  <option value="">Select…</option>
                  {referralOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className={labelClass}>Tell us about your vision</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateForm({ message: e.target.value })}
                  placeholder="Describe your shoot idea, mood, special requirements, or anything you'd like us to know…"
                  rows={4}
                  disabled={loading}
                  className={`${inputClass} resize-y min-h-[110px]`}
                />
              </div>

              <div className="mb-6">
                <label className={labelClass}>Add-ons (optional)</label>
                <div className="flex flex-col gap-2.5 mt-2">
                  {addons.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-center gap-3 cursor-pointer text-sm text-[var(--muted)]"
                    >
                      <input
                        type="checkbox"
                        checked={form.addons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        className="hidden"
                      />
                      <span
                        className={`
                          w-[18px] h-[18px] border rounded-sm flex items-center justify-center shrink-0 transition-all
                          ${form.addons.includes(addon.id)
                            ? 'bg-green border-green'
                            : 'border-[var(--border)]'
                          }
                        `}
                      >
                        {form.addons.includes(addon.id) && (
                          <span className="text-[0.65rem] text-[#040d08]">✓</span>
                        )}
                      </span>
                      {addon.name} (+{currency}
                      {addon.price.toLocaleString('en-IN')})
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => goStep(2)}
                  className="bg-transparent text-[var(--muted)] font-sans text-[0.76rem] tracking-[0.12em] uppercase py-4 px-6 rounded-sm border border-[var(--border)] cursor-pointer hover:border-white/20 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goStep(4)}
                  className="flex-1 bg-green text-[#040d08] font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase py-4 px-8 rounded-sm border-none cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Review Booking →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="animate-[fadeUp_0.4s_ease_both]">
              <h2 className="font-serif text-[1.6rem] font-light text-white mb-2">
                Review &amp; <span className="italic text-green">Confirm</span>
              </h2>
              <p className="text-sm text-[var(--muted)] mb-10 leading-relaxed">
                Please review your booking details before submitting. We&apos;ll send
                a confirmation to your email and WhatsApp within 24 hours.
              </p>

              <div className="bg-surface border border-[var(--border)] rounded-sm p-8 mb-6">
                <div className="text-[0.68rem] tracking-[0.2em] uppercase text-green mb-6">
                  Booking Summary
                </div>
                <div className="space-y-0">
                  {[
                    { key: 'Package', val: form.package ? `${form.package} — ${currency}${form.packagePrice.toLocaleString('en-IN')}` : '—' },
                    { key: 'Type', val: form.shootType || '—' },
                    { key: 'Date', val: form.date ? (() => { const [y,m,d] = form.date!.split('-'); return `${d} ${MONTHS_SHORT[parseInt(m)-1]} ${y}`; })() : '—' },
                    { key: 'Time', val: form.time || '—' },
                    { key: 'Name', val: `${form.firstName} ${form.lastName}`.trim() || '—' },
                    { key: 'Phone', val: form.phone || '—' },
                    { key: 'Email', val: form.email || '—' },
                    { key: 'Location', val: form.location || '—' },
                  ].map(({ key, val }) => (
                    <div
                      key={key}
                      className="flex justify-between items-start py-3 border-b border-[var(--border)] gap-4 last:border-0"
                    >
                      <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
                        {key}
                      </span>
                      <span className="text-[0.88rem] text-white font-serif font-light text-right">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer text-[0.82rem] mb-6">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => updateForm({ agreeTerms: e.target.checked })}
                  className="hidden"
                />
                <span
                  className={`
                    w-[18px] h-[18px] border rounded-sm flex items-center justify-center shrink-0 transition-all
                    ${form.agreeTerms ? 'bg-green border-green' : 'border-[var(--border)]'}
                  `}
                >
                  {form.agreeTerms && (
                    <span className="text-[0.65rem] text-[#040d08]">✓</span>
                  )}
                </span>
                I agree to the booking terms. A 30% advance is required to confirm
                the date.
              </label>

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => goStep(3)}
                  className="bg-transparent text-[var(--muted)] font-sans text-[0.76rem] tracking-[0.12em] uppercase py-4 px-6 rounded-sm border border-[var(--border)] cursor-pointer hover:border-white/20 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green text-[#040d08] font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase py-4 px-8 rounded-sm border-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {loading ? 'Submitting…' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[130px]">
          <div className="bg-surface border border-[var(--border)] rounded-sm p-8 mb-5">
            <div className="text-[0.68rem] tracking-[0.2em] uppercase text-green mb-6">
              Your Selection
            </div>
            <div className="space-y-0">
              <div className="flex justify-between items-start py-3 border-b border-[var(--border)] gap-4">
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
                  Package
                </span>
                <span className="text-[0.88rem] text-white font-serif font-light text-right">
                  {form.package ? (
                    <>
                      {form.package} — {currency}
                      {form.packagePrice.toLocaleString('en-IN')}
                    </>
                  ) : (
                    <span className="text-[var(--muted2)] italic text-sm">Not selected</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-[var(--border)] gap-4">
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
                  Type
                </span>
                <span className="text-[0.88rem] text-white font-serif font-light text-right">
                  {form.shootType || (
                    <span className="text-[var(--muted2)] italic text-sm">Not selected</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-[var(--border)] gap-4">
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
                  Date
                </span>
                <span className="text-[0.88rem] text-white font-serif font-light text-right">
                  {form.date ? (
                    (() => {
                      const [y, m, d] = form.date.split('-');
                      return `${d} ${MONTHS_SHORT[parseInt(m) - 1]} ${y}`;
                    })()
                  ) : (
                    <span className="text-[var(--muted2)] italic text-sm">Not selected</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-[var(--border)] gap-4">
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
                  Time
                </span>
                <span className="text-[0.88rem] text-white font-serif font-light text-right">
                  {form.time || (
                    <span className="text-[var(--muted2)] italic text-sm">Not selected</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-start py-3 border-b border-[var(--border)] gap-4">
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
                  Add-ons
                </span>
                <span className="text-[0.88rem] text-white font-serif font-light text-right">
                  {form.addons.length ? (
                    form.addons
                      .map(
                        (id) =>
                          addons.find((a) => a.id === id)?.name ?? id
                      )
                      .join(', ')
                  ) : (
                    <span className="text-[var(--muted2)] italic text-sm">None</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-start py-4 mt-2 pt-4 border-t border-[var(--border-green)] gap-4">
                <span className="text-[0.75rem] tracking-[0.1em] uppercase text-white shrink-0">
                  Total
                </span>
                <span className="text-green font-serif text-lg font-light text-right">
                  {total > 0 ? `${currency}${total.toLocaleString('en-IN')}` : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[rgba(37,211,102,0.06)] border border-[rgba(37,211,102,0.2)] rounded-sm p-5 flex gap-4">
            <div className="w-9 h-9 rounded-full bg-[rgba(37,211,102,0.15)] flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#25d366"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h4 className="text-[0.82rem] text-white font-medium mb-1">
                Prefer to chat first?
              </h4>
              <p className="text-[0.75rem] text-[var(--muted)] leading-relaxed">
                Message us on WhatsApp and we&apos;ll help you choose the right
                package.
              </p>
              <a
                href={`https://wa.me/${settings.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.72rem] tracking-[0.12em] uppercase text-[#25d366] no-underline inline-block mt-2.5 hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
