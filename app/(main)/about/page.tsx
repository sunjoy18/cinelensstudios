import Link from 'next/link';
import { getSiteSettings } from '@/lib/content';
import { getTeamMembers } from '@/lib/team';
import { Emphasis } from '@/components/Emphasis';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CloudinaryImage } from '@/components/CloudinaryImage';

export default async function AboutPage() {
  const settings = getSiteSettings();
  const teamMembers = await getTeamMembers();
  const about = settings.aboutPage as {
    hero: { eyebrow: string; title: string; quote: string };
    origin: {
      label: string;
      title: string;
      paragraphs: string[];
      quote: string;
      quoteAuthor: string;
    };
    philosophy: {
      label: string;
      title: string;
      subtitle: string;
      items: Array<{ num: string; title: string; desc: string }>;
    };
    stats: Array<{ value: string; label: string }>;
    values: {
      label: string;
      title: string;
      intro: string;
      items: Array<{ name: string; desc: string }>;
    };
    press: string[];
  };

  const founder = teamMembers.find((m) => m.badge === 'Founder' || m.role === 'Founder');

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-16 px-8 md:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,rgba(46,204,138,0.07)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-[820px]">
          <span className="inline-block text-[0.68rem] tracking-[0.28em] uppercase text-green border border-[var(--border-green)] px-4 py-2 rounded-sm mb-8">
            {about.hero.eyebrow}
          </span>
          <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] font-light leading-[1.05] text-white mb-0">
            <span className="whitespace-pre-line">
              <Emphasis text={about.hero.title} />
            </span>
          </h1>
          <p className="font-serif text-[clamp(1.1rem,2.5vw,1.5rem)] font-light italic text-[var(--muted)] leading-relaxed max-w-[640px] mx-auto mt-8">
            {about.hero.quote}
          </p>
        </div>
      </section>

      <section className="py-24 px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-black relative overflow-hidden">
        <div className="absolute left-[-5%] top-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(46,204,138,0.055)_0%,transparent_70%)] pointer-events-none" />
        <ScrollReveal
          className="relative"
        >
          <div className="aspect-[3/4] rounded-sm overflow-hidden border border-[var(--border)] bg-surface flex items-center justify-center relative">
            {founder?.imagePublicId ? (
              <CloudinaryImage
                publicId={founder.imagePublicId}
                alt={founder.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : null}
          </div>
          <div className="absolute -top-6 -left-6 bg-dark border border-[var(--border-green)] p-5 rounded-sm text-center">
            <div className="font-serif text-3xl font-light text-green">{settings.site.foundedYear}</div>
            <div className="text-[0.62rem] tracking-[0.18em] uppercase text-[var(--muted2)] mt-1">Founded</div>
          </div>
        </ScrollReveal>
        <ScrollReveal
          className="relative z-10"
        >
          <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">{about.origin.label}</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-white mb-8">
            <span className="whitespace-pre-line">
              <Emphasis text={about.origin.title} />
            </span>
          </h2>
          {about.origin.paragraphs.map((p, i) => (
            <p key={i} className="text-base text-[var(--muted)] leading-relaxed mb-5 [&_strong]:text-white [&_strong]:font-normal">
              <Emphasis text={p} />
            </p>
          ))}
          <div className="mt-10 p-8 border-l-2 border-green bg-[var(--green-faint)] rounded-r-sm">
            <p className="font-serif text-lg italic text-white leading-relaxed mb-2">{about.origin.quote}</p>
            <cite className="block text-[0.72rem] tracking-[0.12em] uppercase text-green not-italic mt-2">
              {about.origin.quoteAuthor}
            </cite>
          </div>
        </ScrollReveal>
      </section>

      <section className="py-24 px-8 md:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(46,204,138,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <ScrollReveal
            className="text-center mb-20"
          >
            <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">{about.philosophy.label}</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-white mb-4">
              <Emphasis text={about.philosophy.title} />
            </h2>
            <p className="text-[var(--muted)] max-w-[500px] mx-auto leading-relaxed">{about.philosophy.subtitle}</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.philosophy.items.map((item, i) => (
              <ScrollReveal
                key={i}
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm p-10 relative overflow-hidden transition-all hover:border-[var(--border-green)] hover:-translate-y-1"
              >
                <span className="absolute top-6 right-7 font-serif text-5xl font-light text-green/30">{item.num}</span>
                <h3 className="font-serif text-xl font-light text-white mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-5 border-t border-b border-[var(--border)] py-12 px-16">
        {about.stats.map((stat, i) => (
          <div key={i} className="text-center py-0 px-8 border-r border-[var(--border)] last:border-r-0">
            <div className="font-serif text-3xl font-light text-green mb-1">{stat.value}</div>
            <div className="text-[0.7rem] tracking-[0.14em] uppercase text-[var(--muted2)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="py-24 px-8 md:px-16 bg-black">
        <ScrollReveal
          className="text-center mb-16"
        >
          <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">The Crew</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-white">
            Meet the <Emphasis text="{em}Storytellers{/em}" />
          </h2>
          <p className="text-[var(--muted)] mt-4 max-w-[460px] mx-auto leading-relaxed">
            Six people who showed up not for a job, but for a calling.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {teamMembers.map((member, i) => (
            <ScrollReveal
              key={member.id}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-sm overflow-hidden transition-all hover:border-[var(--border-green)] hover:-translate-y-1"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-[#0d1a14] to-[#0a1e10] relative overflow-hidden">
                {member.imagePublicId ? (
                  <>
                    <CloudinaryImage
                      publicId={member.imagePublicId}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                )}
                <span className="absolute top-4 left-4 text-[0.62rem] tracking-[0.16em] uppercase text-[#040d08] bg-green px-2.5 py-1 rounded-sm font-medium z-10">
                  {member.badge}
                </span>
              </div>
              <div className="p-6">
                <div className="font-serif text-xl font-light text-white mb-1">{member.name}</div>
                <div className="text-[0.72rem] tracking-[0.12em] uppercase text-green mb-4">{member.role}</div>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[0.68rem] tracking-[0.1em] text-[var(--muted2)] border border-[var(--border)] px-2.5 py-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 md:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(46,204,138,0.04)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal
          >
            <div className="text-[0.68rem] tracking-[0.25em] uppercase text-green mb-4">{about.values.label}</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-white mb-4">
              <span className="whitespace-pre-line">
                <Emphasis text={about.values.title} />
              </span>
            </h2>
            <p className="text-[var(--muted)] mb-4">{about.values.intro}</p>
            <div className="mt-8">
              {about.values.items.map((item, i) => (
                <div key={i} className="flex gap-5 items-start py-5 border-b border-[var(--border)] first:border-t">
                  <div className="w-2 h-2 rounded-full bg-green shrink-0 mt-2" />
                  <div>
                    <div className="text-sm text-white mb-1">{item.name}</div>
                    <div className="text-[0.82rem] text-[var(--muted)] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal
            className="relative"
          >
            <div className="aspect-[3/4] rounded-sm overflow-hidden border border-[var(--border)] bg-surface" />
            <div className="absolute -bottom-6 -left-6 bg-dark border border-[var(--border-green)] p-6 rounded-sm max-w-[210px]">
              <div className="font-serif text-3xl font-light text-green">100%</div>
              <div className="text-[0.72rem] tracking-[0.12em] uppercase text-[var(--muted)] mt-1">
                Client Return Rate for Second Shoots
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="py-20 px-16 bg-black border-t border-[var(--border)] text-center">
        <div className="text-[0.66rem] tracking-[0.22em] uppercase text-[var(--muted2)] mb-10">
          As seen in & recognised by
        </div>
        <div className="flex gap-12 justify-center flex-wrap">
          {about.press.map((logo, i) => (
            <span key={i} className="font-serif text-lg font-light text-[var(--muted2)] tracking-wide hover:text-[var(--muted)] transition-colors">
              {logo}
            </span>
          ))}
        </div>
      </div>

      <section className="py-24 px-8 md:px-16 bg-dark text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(46,204,138,0.07)_0%,transparent_65%)]" />
        <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-light text-white max-w-[640px] mx-auto mb-6 relative">
          Let&apos;s Create Something <Emphasis text="{em}Together{/em}" />
        </h2>
        <p className="text-[var(--muted)] max-w-[420px] mx-auto mb-12 relative">
          You&apos;ve read our story. Now let&apos;s start writing yours.
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
