import Link from 'next/link';
import { CloudinaryImage } from '@/components/CloudinaryImage';

type Item = {
  category: string;
  title: string;
  imagePublicId?: string | null;
  image?: string | null;
};

export function FeaturedWorkItem({ item, className }: { item: Item; className: string }) {
  return (
    <Link
      href="/portfolio"
      className={`relative overflow-hidden rounded-sm cursor-pointer bg-[var(--card-bg)] border border-[var(--border)] group block ${className}`}
    >
      <div className="absolute inset-0">
        {(item.imagePublicId || item.image) ? (
          <CloudinaryImage
            publicId={item.imagePublicId || item.image || ''}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d1a14] to-[#1a3024] transition-transform duration-700 group-hover:scale-105" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
        <div>
          <span className="text-[0.7rem] tracking-[0.15em] uppercase text-green">{item.category}</span>
          <h3 className="font-serif text-lg font-light text-white">{item.title}</h3>
        </div>
      </div>
    </Link>
  );
}
