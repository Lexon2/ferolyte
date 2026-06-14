import { describe, it } from 'vitest';
import { createMaxStackSize } from '@artifex/pack/content/item/convertors/components/max-stack-size';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createMaxStackSize', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createMaxStackSize);
  });

  it('returns undefined for out of range values', () => {
    expectUndefined(createMaxStackSize, 0);
    expectUndefined(createMaxStackSize, 65);
  });

  it('maps valid stack size', () => {
    expectComponent(createMaxStackSize, 1, 'minecraft:max_stack_size', 1);
    expectComponent(createMaxStackSize, 64, 'minecraft:max_stack_size', 64);
  });
});
