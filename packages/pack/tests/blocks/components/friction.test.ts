import { describe, it } from 'vitest';
import { createFriction } from '@artifex/pack/content/block/components/friction';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createFriction', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createFriction);
  });

  it('returns undefined for out of range value', () => {
    expectUndefined(createFriction, 1);
  });

  it('maps valid friction', () => {
    expectComponent(createFriction, 0.6, 'minecraft:friction', 0.6);
  });
});
