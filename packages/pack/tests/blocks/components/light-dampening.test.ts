import { describe, it } from 'vitest';
import { createLightDampening } from '@artifex/pack/content/block/components/light-dampening';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createLightDampening', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createLightDampening);
  });

  it('returns undefined for out of range value', () => {
    expectUndefined(createLightDampening, 16);
  });

  it('maps valid light dampening', () => {
    expectComponent(createLightDampening, 15, 'minecraft:light_dampening', 15);
  });
});
