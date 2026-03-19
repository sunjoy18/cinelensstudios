'use client';

import { getEmphasisParts } from '@/lib/emphasis';

export function Emphasis({ text }: { text: string }) {
  const parts = getEmphasisParts(text);
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>;
        }
        if (part.type === 'em') {
          return (
            <em key={i} className="italic text-green">
              {part.content}
            </em>
          );
        }
        return (
          <strong key={i} className="font-normal text-white">
            {part.content}
          </strong>
        );
      })}
    </>
  );
}
