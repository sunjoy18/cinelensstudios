import Link from 'next/link';
import { getSiteSettings } from '@/lib/content';
import { getPackages } from '@/lib/packages';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Emphasis } from '@/components/Emphasis';

export default async function PackagesPage() {
  const settings = getSiteSettings();
  const packageItems = await getPackages();
  const pkgSection = { ...settings.packages, items: packageItems };
  const { faq } = settings;

  return (
    <>
      <div className="pt-24 pb-16 px-8 md:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_50%_100%,rgba(46,204,138,0.06)_0%,transparent_65%)]" />
        <div className="relative z-10 text-center max-w-[660px] mx-auto">
          <span className="text-[0.68rem] tracking-[0.28em] uppercase text-green mb-4 block">
            Pricing & Packages
          </span>
          <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-light leading-[1.08] text-white">
            <Emphasis text={pkgSection.title} />
          </h1>
          <p className="text-[var(--muted)] leading-relaxed mt-5">
            Every package is crafted to give you a complete cinematic experience — from the first frame to final delivery.
          </p>
        </div>
      </div>

      <section className="py-16 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1100px] mx-auto items-start">
          {pkgSection.items.map((pkg, i) => (
            <ScrollReveal
              key={pkg.id}
              className={`bg-[var(--card-bg)] border rounded-lg relative overflow-hidden transition-all flex flex-col ${
                pkg.featured
                  ? 'border-[var(--border-green)] bg-green/5 -translate-y-2 hover:-translate-y-3'
                  : 'border-[var(--border)] hover:border-white/15 hover:-translate-y-1'
              }`}
            >
              {pkg.featured && pkg.badge && (
                <span className="absolute top-5 right-5 text-[0.62rem] tracking-[0.14em] uppercase text-[#040d08] bg-green px-3 py-1.5 rounded-sm font-medium">
                  {pkg.badge}
                </span>
              )}
              <div className="p-8">
                <div className="w-10 h-10 rounded-sm border border-[var(--border-green)] flex items-center justify-center mb-5 bg-[var(--green-faint)]" />
                <div className="font-serif text-2xl font-light text-white mb-1">{pkg.name}</div>
                <div className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                  {pkg.id === 'essentials' && 'Perfect for intimate sessions, headshots, and couple shoots. Clean, focused, beautiful.'}
                  {pkg.id === 'cinematic' && 'Our signature package. Full storytelling — multiple looks, locations, and a cinematic feel throughout.'}
                  {pkg.id === 'full-day' && 'Complete event or wedding coverage. Everything, from first light to last dance.'}
                </div>
              </div>
              <div className="px-8 pb-6 border-b border-[var(--border)]">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-xl text-green">{pkgSection.currency}</span>
                  <span className="font-serif text-4xl font-light text-white">{pkg.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-sm text-[var(--muted)] mt-1">{pkg.billingNote}</div>
              </div>
              <div className="p-8 flex-1">
                <div className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--muted2)] mb-4">What&apos;s Included</div>
                <ul className="space-y-0">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 py-2.5 border-b border-[var(--border)] last:border-0 text-sm text-[var(--muted)]">
                      <span className="w-[18px] h-[18px] rounded-full bg-green/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="#2ecc8a" strokeWidth="1.2">
                          <path d="M2 5l2 2 4-4" strokeLinecap="round" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8">
                <Link
                  href="/booking"
                  className={`block w-full text-center py-4 rounded-sm font-sans text-[0.76rem] font-medium tracking-[0.14em] uppercase no-underline transition-opacity hover:opacity-90 ${
                    pkg.featured
                      ? 'bg-green text-[#040d08]'
                      : 'bg-transparent border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-green)] hover:text-green'
                  }`}
                >
                  Book {pkg.name}
                </Link>
                <p className="text-center text-[0.72rem] text-[var(--muted2)] mt-3 leading-relaxed">
                  30% advance to confirm · Balance on delivery
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-16 px-8 md:px-16 max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">Questions</div>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light text-white">
            Frequently <Emphasis text="{em}Asked{/em}" />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faq.packages.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      <div className="mx-8 md:mx-16 mb-24 bg-dark border border-[var(--border-green)] rounded-lg p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_100%_50%,rgba(46,204,138,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[500px]">
          <h2 className="font-serif text-2xl font-light text-white mb-2">
            Still Deciding? Let&apos;s <Emphasis text="{em}Talk{/em}" />
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Not sure which package fits your vision? Send us a message on WhatsApp and we&apos;ll help you figure it out — no pressure, no sales pitch.
          </p>
        </div>
        <div className="flex gap-4 shrink-0 relative z-10">
          <Link
            href="/booking"
            className="bg-green text-[#040d08] font-sans text-[0.76rem] font-medium tracking-[0.14em] uppercase px-8 py-4 rounded-sm no-underline transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            Book a Shoot
          </Link>
          <a
            href={`https://wa.me/${settings.contact.whatsapp}`}
            className="bg-transparent text-[var(--muted)] font-sans text-[0.76rem] tracking-[0.14em] uppercase px-8 py-4 border border-[var(--border)] rounded-sm no-underline transition-colors hover:border-[var(--border-green)] hover:text-green whitespace-nowrap"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm overflow-hidden group">
      <summary className="p-5 flex justify-between items-center gap-4 cursor-pointer text-white font-sans text-sm font-light list-none hover:text-green transition-colors [&::-webkit-details-marker]:hidden">
        {question}
        <span className="w-5 h-5 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] text-xs shrink-0 group-open:rotate-45 group-open:border-[var(--border-green)] group-open:text-green transition-all">
          +
        </span>
      </summary>
      <div className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed">{answer}</div>
    </details>
  );
}
