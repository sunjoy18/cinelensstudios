import { getSiteSettings } from '@/lib/content';
import { getPortfolioItems } from '@/lib/portfolio';
import { Emphasis } from '@/components/Emphasis';
import { PortfolioGrid } from '@/components/PortfolioGrid';

export const revalidate = 60;

export default async function PortfolioPage() {
  const settings = getSiteSettings();
  const portfolio = settings.portfolioPage as {
    eyebrow: string;
    title: string;
    subtitle: string;
    filters: string[];
  };
  const featuredWork = settings.featuredWork;

  let items = await getPortfolioItems();

  const fallbackItems = featuredWork.items.map(
    (
      item: { category: string; title: string; image?: string | null; imagePublicId?: string },
      i: number
    ) => ({
      id: `fallback-${i}`,
      category: item.category,
      title: item.title,
      imagePublicId: item.imagePublicId || item.image || '',
    })
  );

  const displayItems = items.length > 0 ? items : fallbackItems;

  return (
    <>
      <div className="pt-14 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-14 px-4 sm:px-6 md:px-8 lg:px-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_100%_50%,rgba(46,204,138,0.04)_0%,transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 flex-wrap">
          <div className="max-w-[560px]">
            <span className="text-[0.68rem] tracking-[0.28em] uppercase text-green mb-4 block">
              {portfolio.eyebrow}
            </span>
            <h1 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-light leading-[1.08] text-white">
              <Emphasis text={portfolio.title} />
            </h1>
            <p className="text-[var(--muted)] leading-relaxed mt-4">{portfolio.subtitle}</p>
          </div>
          <div className="flex gap-6 sm:gap-8 flex-wrap">
            <div>
              <div className="font-serif text-3xl font-light text-green">{displayItems.length}+</div>
              <div className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] mt-1">Projects</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-light text-green">{portfolio.filters.length - 1}</div>
              <div className="text-[0.68rem] tracking-[0.12em] uppercase text-[var(--muted2)] mt-1">Categories</div>
            </div>
          </div>
        </div>
      </div>

      <PortfolioGrid items={displayItems} filters={portfolio.filters} />
    </>
  );
}
