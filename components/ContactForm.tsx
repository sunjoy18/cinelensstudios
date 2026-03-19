'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Emphasis } from '@/components/Emphasis';
import type { SiteSettings } from '@/lib/content';

export function ContactForm({ settings }: { settings: SiteSettings }) {
  const contactPage = settings.contactPage as {
    eyebrow: string;
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    subjects: string[];
    successTitle: string;
    successMessage: string;
  };

  const [selectedSubject, setSelectedSubject] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: selectedSubject || formData.get('subject'),
      message: formData.get('message'),
      source: formData.get('source'),
      preferredDate: formData.get('preferredDate'),
      location: formData.get('location'),
    };

    if (!data.firstName || !data.email || !data.message) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setSuccess(true);
      else throw new Error('Failed');
    } catch {
      alert('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 lg:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_90%_at_0%_60%,rgba(46,204,138,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10 flex-wrap">
          <div className="max-w-[540px]">
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-green mb-4 block">
              {contactPage.eyebrow}
            </span>
            <h1 className="font-serif text-[clamp(2.6rem,5.5vw,4.2rem)] font-light leading-[1.06] text-white">
              <span className="whitespace-pre-line">
                <Emphasis text={contactPage.title} />
              </span>
            </h1>
            <p className="text-[var(--muted)] leading-relaxed mt-5">{contactPage.subtitle}</p>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--border-green)] p-4 sm:p-6 rounded-sm flex items-center gap-4 w-full md:w-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-green animate-pulse shrink-0" />
            <div>
              <strong className="block text-white text-sm font-normal mb-0.5">{settings.contact.availability}</strong>
              <span className="text-[0.74rem] text-[var(--muted)]">Responding within {settings.contact.responseTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 md:gap-10 p-4 sm:p-6 md:p-8 lg:p-16 max-w-[1200px] mx-auto items-start">
        <div
          className="bg-surface border border-[var(--border)] rounded-lg p-8"
        >
          {!success ? (
            <>
              <h2 className="font-serif text-2xl font-light text-white mb-2">
                <Emphasis text={contactPage.formTitle} />
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-10">{contactPage.formSubtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                    What&apos;s this about?
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {contactPage.subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSubject(s)}
                        className={`text-[0.74rem] tracking-[0.1em] border rounded-sm px-4 py-2 cursor-pointer transition-colors ${
                          selectedSubject === s
                            ? 'border-[var(--border-green)] text-green bg-[var(--green-faint)]'
                            : 'border-[var(--border)] text-[var(--muted)] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Arjun"
                      className="w-full bg-black border border-[var(--border)] rounded-sm text-white font-sans text-sm font-light px-4 py-3 outline-none focus:border-[var(--border-green)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Sharma"
                      className="w-full bg-black border border-[var(--border)] rounded-sm text-white font-sans text-sm font-light px-4 py-3 outline-none focus:border-[var(--border-green)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-black border border-[var(--border)] rounded-sm text-white font-sans text-sm font-light px-4 py-3 outline-none focus:border-[var(--border-green)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      className="w-full bg-black border border-[var(--border)] rounded-sm text-white font-sans text-sm font-light px-4 py-3 outline-none focus:border-[var(--border-green)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.68rem] tracking-[0.16em] uppercase text-[var(--muted)] mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your vision..."
                    className="w-full bg-black border border-[var(--border)] rounded-sm text-white font-sans text-sm font-light px-4 py-3 outline-none focus:border-[var(--border-green)] resize-y min-h-[120px]"
                  />
                </div>

                <div className="flex items-center gap-6 flex-wrap pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green text-[#040d08] font-sans text-[0.76rem] font-medium tracking-[0.14em] uppercase px-10 py-4 rounded-sm border-none cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                  <p className="text-[0.74rem] text-[var(--muted2)] leading-relaxed">
                    We read every message personally.<br />No bots. No automated replies.
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full border border-[var(--border-green)] bg-[var(--green-faint)] flex items-center justify-center mx-auto mb-6">
                <svg viewBox="0 0 26 26" className="w-7 h-7" fill="none" stroke="#2ecc8a" strokeWidth="1.5">
                  <circle cx="13" cy="13" r="12" />
                  <path d="M7 13l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-light text-white mb-2">
                <Emphasis text={contactPage.successTitle} />
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed max-w-[380px] mx-auto mb-8">
                {contactPage.successMessage}
              </p>
              <Link href="/portfolio" className="text-[0.76rem] tracking-[0.13em] uppercase text-green no-underline">
                View Our Portfolio →
              </Link>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          <div
            className="bg-surface border border-[var(--border)] rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-[var(--border)]">
              <div className="text-[0.68rem] tracking-[0.2em] uppercase text-green mb-2">Direct Contact</div>
              <div className="font-serif text-lg font-light text-white leading-snug">
                Prefer to reach out<br />directly? We&apos;re here.
              </div>
            </div>
            <a
              href={`tel:+${settings.contact.phoneRaw}`}
              className="flex items-center gap-4 p-5 border-b border-[var(--border)] hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-sm border border-[var(--border)] flex items-center justify-center shrink-0" />
              <div>
                <div className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] mb-0.5">Phone</div>
                <div className="text-sm text-white">{settings.contact.phone}</div>
              </div>
            </a>
            <a
              href={`https://wa.me/${settings.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border-b border-[var(--border)] hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-sm border border-[var(--border)] flex items-center justify-center shrink-0" />
              <div>
                <div className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] mb-0.5">WhatsApp</div>
                <div className="text-sm text-white">Chat with us →</div>
              </div>
            </a>
            <a
              href={`mailto:${settings.contact.email}`}
              className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-sm border border-[var(--border)] flex items-center justify-center shrink-0" />
              <div>
                <div className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] mb-0.5">Email</div>
                <div className="text-sm text-white">{settings.contact.email}</div>
              </div>
            </a>
          </div>

          <div
            className="bg-surface border border-[var(--border)] rounded-lg p-6"
          >
            <div className="text-[0.66rem] tracking-[0.2em] uppercase text-[var(--muted2)] mb-5">Studio Hours</div>
            {settings.hours.map((h, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--muted)] text-sm">{h.days}</span>
                <span className={`text-sm ${h.closed ? 'text-[var(--muted2)]' : 'text-white'}`}>{h.time}</span>
              </div>
            ))}
            <p className="text-[0.74rem] text-[var(--muted2)] mt-4 leading-relaxed">{settings.hoursNote}</p>
          </div>
        </aside>
      </div>

      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-16 text-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(46,204,138,0.06)_0%,transparent_65%)]" />
        <h2 className="font-serif text-[clamp(2rem,4.5vw,3.6rem)] font-light text-white max-w-[580px] mx-auto mb-5 relative">
          Ready to Tell Your <Emphasis text="{em}Story?{/em}" />
        </h2>
        <p className="text-[var(--muted)] max-w-[420px] mx-auto mb-12 leading-relaxed relative">
          Skip the form and jump straight to booking your session — we&apos;ll handle the rest.
        </p>
        <div className="flex gap-4 justify-center flex-wrap relative">
          <Link
            href="/booking"
            className="bg-green text-[#040d08] font-sans text-[0.76rem] font-medium tracking-[0.14em] uppercase px-10 py-4 rounded-sm no-underline transition-opacity hover:opacity-90"
          >
            Book a Shoot
          </Link>
          <Link
            href="/portfolio"
            className="bg-transparent text-[var(--muted)] font-sans text-[0.76rem] tracking-[0.14em] uppercase px-10 py-4 border border-[var(--border)] rounded-sm no-underline transition-colors hover:border-[var(--border-green)] hover:text-green"
          >
            View Our Work
          </Link>
        </div>
      </section>
    </>
  );
}
