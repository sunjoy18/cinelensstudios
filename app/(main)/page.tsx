import Link from 'next/link';
import { getSiteSettings } from '@/lib/content';
import { getPackages } from '@/lib/packages';
import { getFeaturedWork } from '@/lib/featured-work';
import { Emphasis } from '@/components/Emphasis';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FeaturedWorkItem } from '@/components/FeaturedWorkItem';

export default async function HomePage() {
  const settings = getSiteSettings();
  const packageItems = await getPackages();
  const featuredWorkItems = await getFeaturedWork();
  const packages = { ...settings.packages, items: packageItems };
  const { hero, featuredWork, about, beliefs, testimonials, cta } = settings;

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center pt-24 pb-16 px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_60%,rgba(46,204,138,0.07)_0%,transparent_70%),radial-gradient(ellipse_40%_30%_at_20%_80%,rgba(46,204,138,0.04)_0%,transparent_60%),linear-gradient(160deg,#0a0a0d_0%,#060608_50%,#080b0a_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(46,204,138,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(46,204,138,0.04)_1px,transparent_1px)] bg-[length:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_30%,transparent_100%)]" />
        <div className="relative z-10 max-w-[820px]">
          <span className="inline-block text-[0.7rem] tracking-[0.28em] uppercase text-green border border-[var(--border-green)] px-5 py-2 rounded-sm mb-8 animate-[fadeUp_0.8s_ease_both]">
            {hero.eyebrow}
          </span>
          <h1 className="font-serif text-[clamp(3.2rem,8vw,6.5rem)] font-light leading-[1.05] tracking-tight text-white mb-2 animate-[fadeUp_0.8s_0.1s_ease_both]">
            <span className="whitespace-pre-line"><Emphasis text={hero.title} /></span>
          </h1>
          <p className="font-serif text-[clamp(1.1rem,2.5vw,1.55rem)] font-light italic text-[var(--muted)] tracking-wide my-6 mb-10 animate-[fadeUp_0.8s_0.2s_ease_both]">
            {hero.tagline}
          </p>
          <div className="flex gap-5 justify-center flex-wrap animate-[fadeUp_0.8s_0.3s_ease_both]">
            <Link
              href={hero.primaryCtaHref}
              className="bg-green text-[#040d08] font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase px-10 py-4 rounded-sm no-underline transition-opacity hover:opacity-90"
            >
              {hero.primaryCta}
            </Link>
            <Link
              href={hero.secondaryCtaHref}
              className="text-white font-sans text-[0.78rem] font-normal tracking-[0.14em] uppercase px-10 py-4 border border-[var(--border)] rounded-sm no-underline transition-colors hover:border-white/30"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)] text-[0.68rem] tracking-[0.2em] uppercase animate-[fadeUp_1s_0.5s_ease_both]">
          <div className="w-px h-10 bg-gradient-to-b from-green to-transparent animate-pulse" />
          <span>{hero.scrollLabel}</span>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 px-8 md:px-16 bg-dark">
        <ScrollReveal className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">
          {featuredWork.label}
        </ScrollReveal>
        <ScrollReveal className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-white max-w-[560px] mb-14">
          <Emphasis text={featuredWork.title} />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {featuredWorkItems.map((item, i) => (
            <ScrollReveal
              key={i}
              delay={i * 80}
              className={`${
                i === 0 ? 'lg:col-span-7 aspect-[16/10]' : ''
              } ${i === 1 ? 'lg:col-span-5 aspect-[4/5]' : ''} ${i === 2 ? 'lg:col-span-4 aspect-[4/5]' : ''} ${
                i === 3 ? 'lg:col-span-8 aspect-[16/10]' : ''
              }`}
            >
              <FeaturedWorkItem item={item} className="w-full h-full min-h-[200px]" />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-24 px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-black relative overflow-hidden">
        <div className="absolute right-[-10%] top-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(46,204,138,0.06)_0%,transparent_70%)] pointer-events-none" />
        <ScrollReveal className="relative aspect-[3/4] rounded-sm overflow-hidden border border-[var(--border)]">
          <div className="w-full h-full bg-gradient-to-br from-[#0d1a14] via-[#0a1208] to-[#141a10] flex items-center justify-center" />
          <div className="absolute -bottom-6 -right-6 bg-dark border border-[var(--border-green)] p-6 rounded max-w-[220px]">
            <span className="text-green text-2xl">&ldquo;</span>
            <p className="font-serif text-sm italic text-[var(--muted)] leading-relaxed">{about.quote}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal className="relative z-10">
          <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">{about.label}</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-white mb-6">
            <Emphasis text={about.title} />
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-[1.05rem] leading-relaxed text-[var(--muted)] mb-5 [&_strong]:text-white [&_strong]:font-normal">
              <Emphasis text={p} />
            </p>
          ))}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-[var(--border)]">
            {about.stats.map((stat, i) => (
              <div key={i}>
                <div className="font-serif text-3xl font-light text-green">{stat.value}</div>
                <div className="text-[0.72rem] tracking-[0.12em] uppercase text-[var(--muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Beliefs */}
      <section className="py-24 px-8 md:px-16 bg-dark text-center">
        <ScrollReveal className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">
          {beliefs.label}
        </ScrollReveal>
        <ScrollReveal className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-white mb-0 max-w-full">
          <Emphasis text={beliefs.title} />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto mt-16">
          {beliefs.items.map((item, i) => (
            <ScrollReveal
              key={i}
              delay={i * 80}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-10 text-left relative overflow-hidden transition-all hover:border-[var(--border-green)] hover:-translate-y-1"
            >
              <span className="font-serif text-4xl font-light text-green/30 block mb-4 pb-4 border-b border-[var(--border)]">
                {item.num}
              </span>
              <h3 className="font-serif text-xl font-light text-white mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-8 md:px-16 bg-black">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-8">
          <div>
            <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">{packages.label}</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-white">
              <Emphasis text={packages.title} />
            </h2>
          </div>
          <p className="text-[var(--muted)] text-sm max-w-[280px] text-right leading-relaxed">{packages.intro}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.items.map((pkg, i) => (
            <ScrollReveal
              key={pkg.id}
              delay={100}
              className={`bg-[var(--card-bg)] border rounded-sm p-8 flex flex-col transition-colors ${
                pkg.featured ? 'border-[var(--border-green)] bg-green/5 relative' : 'border-[var(--border)] hover:border-white/15'
              }`}
            >
              {pkg.featured && pkg.badge && (
                <span className="absolute top-0 right-0 text-[0.65rem] tracking-[0.15em] uppercase text-[#040d08] bg-green px-4 py-1.5 rounded-bl-sm">
                  {pkg.badge}
                </span>
              )}
              <div className="font-serif text-2xl font-light text-white mb-1">{pkg.name}</div>
              <div className="text-[0.72rem] tracking-[0.15em] uppercase text-green mb-6">{pkg.duration}</div>
              <div className="font-serif text-4xl font-light text-white mb-1">
                <sup className="text-xl">{packages.currency}</sup>
                {pkg.price.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-[var(--muted)] mb-8 pb-6 border-b border-[var(--border)]">{pkg.billingNote}</div>
              <ul className="list-none flex-1">
                {pkg.features.map((f, j) => (
                  <li
                    key={j}
                    className="text-sm text-[var(--muted)] py-2.5 border-b border-[var(--border)] flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/booking"
                className={`mt-8 block text-center text-[0.75rem] tracking-[0.14em] uppercase py-4 rounded-sm no-underline transition-colors ${
                  pkg.featured
                    ? 'bg-green text-[#040d08] font-medium'
                    : 'border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-green)] hover:text-green'
                }`}
              >
                Book This Package
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 md:px-16 bg-dark overflow-hidden">
        <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">{testimonials.label}</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-white mb-14">
          <Emphasis text={testimonials.title} />
        </h2>
        <div className="overflow-hidden mt-14">
          <div className="flex gap-6 animate-slideTestis w-max hover:[animation-play-state:paused]">
            {[...testimonials.items, ...testimonials.items].map((t, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-8 w-[340px] shrink-0"
              >
                <div className="text-green text-sm tracking-widest mb-4">★★★★★</div>
                <p className="font-serif text-lg font-light italic text-white leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-dim flex items-center justify-center text-sm font-medium text-white shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm text-white">{t.author}</div>
                    <div className="text-[0.72rem] text-[var(--muted)] mt-0.5">{t.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 md:px-16 text-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(46,204,138,0.08)_0%,transparent_70%)]" />
        <h2 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-tight text-white max-w-[700px] mx-auto mb-6 relative">
          <Emphasis text={cta.title} />
        </h2>
        <p className="text-base text-[var(--muted)] mb-12 relative">{cta.subtitle}</p>
        <div className="flex gap-4 justify-center flex-wrap relative">
          <a
            href={`mailto:${settings.contact.email}`}
            className="bg-green text-[#040d08] font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase px-10 py-4 rounded-sm no-underline transition-opacity hover:opacity-90"
          >
            {cta.primaryCta}
          </a>
          <a
            href={`https://wa.me/${settings.contact.whatsapp}`}
            className="text-white font-sans text-[0.78rem] font-normal tracking-[0.14em] uppercase px-10 py-4 border border-[var(--border)] rounded-sm no-underline transition-colors hover:border-white/30"
          >
            {cta.secondaryCta}
          </a>
        </div>
        <div className="mt-16 flex justify-center gap-12 flex-wrap">
          <div className="text-center">
            <div className="text-[0.68rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-1.5">Phone</div>
            <div className="font-serif text-lg text-white">{settings.contact.phone}</div>
          </div>
          <div className="text-center">
            <div className="text-[0.68rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-1.5">Email</div>
            <div className="font-serif text-lg text-white">{settings.contact.email}</div>
          </div>
          <div className="text-center">
            <div className="text-[0.68rem] tracking-[0.2em] uppercase text-[var(--muted)] mb-1.5">Instagram</div>
            <div className="font-serif text-lg text-white">{settings.social[0]?.handle || '@cinelensstudios'}</div>
          </div>
        </div>
      </section>

    </>
  );
}
