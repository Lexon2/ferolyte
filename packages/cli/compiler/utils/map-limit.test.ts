import { describe, expect, it } from 'vitest';

import { mapLimit } from './map-limit';

describe('mapLimit', () => {
  it('keeps order and respects the limit', async () => {
    let active = 0;
    let peak = 0;
    const result = await mapLimit([5, 1, 4, 2, 3, 0], 2, async (n) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, n));
      active--;

      return n * 2;
    });

    expect(result).toEqual([10, 2, 8, 4, 6, 0]);
    expect(peak).toBe(2);
  });

  it('handles empty input and rejects on error', async () => {
    expect(await mapLimit([], 4, async () => 1)).toEqual([]);
    await expect(
      mapLimit([1, 2], 1, async (n) => {
        if (n === 2) {
          throw new Error('boom');
        }
      }),
    ).rejects.toThrow('boom');
  });
});
