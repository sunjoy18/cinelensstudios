/** Replace {em}...{/em} and {strong}...{/strong} with placeholders for splitting */
export function getEmphasisParts(text: string): Array<{ type: 'text' | 'em' | 'strong'; content: string }> {
  if (!text) return [];
  const parts: Array<{ type: 'text' | 'em' | 'strong'; content: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    const emMatch = remaining.match(/\{em\}(.*?)\{\/em\}/);
    const strongMatch = remaining.match(/\{strong\}(.*?)\{\/strong\}/);

    let earliest = { index: -1, type: '' as 'em' | 'strong', match: null as RegExpMatchArray | null };
    if (emMatch && emMatch.index !== undefined) {
      earliest = { index: emMatch.index, type: 'em', match: emMatch };
    }
    if (strongMatch && strongMatch.index !== undefined && (earliest.index < 0 || strongMatch.index < earliest.index)) {
      earliest = { index: strongMatch.index, type: 'strong', match: strongMatch };
    }

    if (earliest.index < 0) {
      parts.push({ type: 'text', content: remaining.replace(/\\n/g, '\n') });
      break;
    }

    const match = earliest.match!;
    if (earliest.index > 0) {
      parts.push({ type: 'text', content: remaining.slice(0, earliest.index).replace(/\\n/g, '\n') });
    }
    parts.push({ type: earliest.type as 'em' | 'strong', content: match[1] });
    remaining = remaining.slice(earliest.index + match[0].length);
  }

  return parts;
}
