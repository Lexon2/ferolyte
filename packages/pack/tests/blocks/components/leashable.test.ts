import { describe, it } from 'vitest';
import { createLeashable } from '@artifex/pack/content/block/components/leashable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createLeashable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createLeashable);
  });

  it('returns undefined for invalid offset', () => {
    expectUndefined(createLeashable, { offset: [0, 0] });
  });

  it('maps offset', () => {
    expectComponent(createLeashable, { offset: [0, 0.5, 0] }, 'minecraft:leashable', {
      offset: [0, 0.5, 0],
    });
  });
});
