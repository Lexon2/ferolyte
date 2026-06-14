import { describe, it } from 'vitest';
import { createBundleInteraction } from '@artifex/pack/content/item/convertors/components/bundle-interaction';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createBundleInteraction', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createBundleInteraction);
  });

  it('maps numViewableSlots', () => {
    expectComponent(createBundleInteraction, { numViewableSlots: 8 }, 'minecraft:bundle_interaction', {
      num_viewable_slots: 8,
    });
  });

  it('returns empty object when no slots specified', () => {
    expectComponent(createBundleInteraction, {}, 'minecraft:bundle_interaction', {});
  });
});
