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
      <div className="sticky top-[65px] z-[100] bg-black/95 backdrop-blur-md border-b border-[var(--border)] px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 py-4">
        <div className="flex gap-0 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[0.74rem] tracking-[0.14em] uppercase px-5 py-4 border-none bg-transparent cursor-pointer transition-colors whitespace-nowrap relative ${
                activeFilter === filter ? 'text-white' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {filter}
              {activeFilter === filter && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green" />
              )}
            </button>
          ))}
        </div>
        <div className="text-[0.72rem] tracking-[0.1em] uppercase text-[var(--muted2)]">
          Showing <span className="text-green">{filteredItems.length}</span> works
        </div>
      </div>

      <section className="py-12 px-8 md:px-16">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {filteredItems.map((item, i) => (
            <ScrollReveal
              key={item.id}
              delay={i % 6 === 0 ? 0 : 50}
              className="break-inside-avoid mb-4 rounded-sm overflow-hidden border border-[var(--border)] cursor-pointer group relative"
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
