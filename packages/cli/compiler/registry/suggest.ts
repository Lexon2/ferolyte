/** Levenshtein distance (two-row). */
export const editDistance = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }

  return previous[b.length];
};

/**
 * Closest candidate for a mistyped value, or `undefined` when nothing is close
 * enough (distance up to a quarter of the length, at least 2).
 */
export const closestMatch = (
  value: string,
  candidates: Iterable<string>,
): string | undefined => {
  const limit = Math.max(2, Math.floor(value.length / 4));
  let best: string | undefined;
  let bestDistance = Infinity;

  for (const candidate of candidates) {
    const distance = editDistance(value, candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return bestDistance <= limit ? best : undefined;
};

/** `unknown geometry "x" (did you mean "y"?)`. */
export const unknownMessage = (
  what: string,
  value: string,
  candidates: Iterable<string>,
): string => {
  const suggestion = closestMatch(value, candidates);

  return `unknown ${what} "${value}"${suggestion ? ` (did you mean "${suggestion}"?)` : ''}`;
};
