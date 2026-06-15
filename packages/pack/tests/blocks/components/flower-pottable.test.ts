import { describe, it } from 'vitest';
import { createFlowerPottable } from '@ferolyte/pack/content/block/components/flower-pottable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createFlowerPottable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createFlowerPottable);
  });

  it('returns undefined for false', () => {
    expectUndefined(createFlowerPottable, false);
  });

  it('maps true to empty component', () => {
    expectComponent(
      createFlowerPottable,
      true,
      'minecraft:flower_pottable',
      {},
    );
  });
});
