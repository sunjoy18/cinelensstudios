'use client';

type StarRatingProps = {
  rating: number;
  max?: number;
  className?: string;
};

export function StarRating({ rating, max = 5, className = '' }: StarRatingProps) {
  const r = Math.min(max, Math.max(0, Number(rating) || 0));

  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${r} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, r - i));
        return (
          <span key={i} className="relative inline-block w-4 h-4 text-base leading-none">
            {/* Base: unfilled star */}
            <span className="text-[var(--muted2)] opacity-60" aria-hidden>★</span>
            {/* Overlay: filled portion */}
            {fill > 0 && (
              <span
                className="absolute left-0 top-0 overflow-hidden text-green"
                style={{ width: `${fill * 100}%` }}
                aria-hidden
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
