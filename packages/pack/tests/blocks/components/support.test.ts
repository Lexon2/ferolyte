import { describe, it } from 'vitest';
import { createSupport } from '@ferolyte/pack/content/block/components/support';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createSupport', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createSupport);
  });

  it('returns undefined for invalid shape', () => {
    expectUndefined(createSupport, { shape: 'wall' });
  });

  it('maps support shape', () => {
    expectComponent(createSupport, { shape: 'fence' }, 'minecraft:support', {
      shape: 'fence',
    });
  });
});
