const parseVersion = (version: string): number[] =>
  version.split('.').map((part) => Number.parseInt(part, 10) || 0);

/**
 * Compares dotted game versions (`1.26.40`). Returns a negative number when
 * `a < b`, positive when `a > b` and `0` when equal.
 */
export const compareVersions = (a: string, b: string): number => {
  const left = parseVersion(a);
  const right = parseVersion(b);
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }

  return 0;
};

export const isVersionAtLeast = (version: string, minimum: string): boolean =>
  compareVersions(version, minimum) >= 0;
