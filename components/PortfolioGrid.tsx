'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CloudinaryImage } from '@/components/CloudinaryImage';

type PortfolioItem = {
  id: string;
  category: string;
  title: string;
  imagePublicId: string;
};

export function PortfolioGrid({
  items,
  filters,
}: {
  items: PortfolioItem[];
  filters: string[];
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredItems =
    activeFilter === 'All'
      ? items
      : items.filter((item) => item.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <>
      <div className="sticky top-[52px] sm:top-[60px] z-[90] bg-black/98 backdrop-blur-md border-b border-[var(--border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-0 md:gap-6 py-0 md:py-4 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-x-auto md:overflow-visible scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-6 md:px-0">
          <div className="flex gap-0 min-w-max md:min-w-0 md:flex-wrap md:flex-1 py-3 md:py-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-[0.8rem] sm:text-[0.74rem] tracking-[0.12em] sm:tracking-[0.14em] uppercase px-4 sm:px-5 py-3.5 sm:py-4 border-none bg-transparent cursor-pointer transition-colors whitespace-nowrap relative touch-manipulation ${
                  activeFilter === filter ? 'text-white font-medium' : 'text-[var(--muted)] hover:text-white'
                }`}
              >
                {filter}
                {activeFilter === filter && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:block text-[0.72rem] tracking-[0.1em] uppercase text-[var(--muted2)] shrink-0">
          Showing <span className="text-green">{filteredItems.length}</span> works
        </div>
        <div className="md:hidden text-center py-2.5 text-[0.8rem] tracking-[0.1em] uppercase text-[var(--muted2)] border-t border-[var(--border)]">
          Showing <span className="text-green">{filteredItems.length}</span> works
        </div>
      </div>

      <section className="py-6 sm:py-12 px-0 sm:px-6 md:px-8 lg:px-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 sm:gap-4">
          {filteredItems.map((item, i) => (
            <ScrollReveal
              key={item.id}
              delay={i % 6 === 0 ? 0 : 50}
              className="break-inside-avoid mb-2 sm:mb-4 rounded-none sm:rounded-sm overflow-hidden border-0 sm:border border-[var(--border)] cursor-pointer group relative"
            >
              <Link href={`/portfolio?view=${item.id}`} className="block">
                <div className="aspect-[4/5] relative bg-gradient-to-br from-[#0d1a14] to-[#1a3024] overflow-hidden">
                  {item.imagePublicId ? (
                    <CloudinaryImage
                      publicId={item.imagePublicId}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0d1a14] to-[#1a3024] transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 pointer-events-none">
                  <div>
                    <span className="text-[0.7rem] tracking-[0.15em] uppercase text-green">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg font-light text-white">{item.title}</h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
