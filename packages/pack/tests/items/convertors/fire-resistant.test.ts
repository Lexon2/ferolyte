import { describe, expect, it } from 'vitest';
import { createFireResistant } from '@artifex/pack/content/item/convertors/components/fire-resistant';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createFireResistant', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createFireResistant);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createFireResistant, 'invalid');
  });

  it('maps valid boolean to minecraft:fire_resistant', () => {
    expectComponent(createFireResistant, true, 'minecraft:fire_resistant', true);
    expectComponent(createFireResistant, false, 'minecraft:fire_resistant', false);
  });
});
