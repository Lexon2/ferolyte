import { describe, it } from 'vitest';
import { createLightEmission } from '@ferolyte/pack/content/block/components/light-emission';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createLightEmission', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createLightEmission);
  });

  it('returns undefined for non-integer value', () => {
    expectUndefined(createLightEmission, 1.5);
  });

  it('maps valid light emission', () => {
    expectComponent(createLightEmission, 7, 'minecraft:light_emission', 7);
  });
});
