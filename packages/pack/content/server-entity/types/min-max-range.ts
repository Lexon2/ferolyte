/**
 * A numeric range. Accepts a single number (fixed value), a `[min, max]` tuple
 * or a `{ min, max }` object. Always emitted as `{ min, max }`.
 */
export type MinMaxRange =
  | number
  | [number, number]
  | { min?: number; max?: number }
  /** @deprecated use `{ min, max }` */
  | { rangeMin: number; rangeMax: number };
