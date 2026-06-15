import { describe, it } from 'vitest';
import { createReplaceable } from '@ferolyte/pack/content/block/components/replaceable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createReplaceable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createReplaceable);
  });

  it('returns undefined for false', () => {
    expectUndefined(createReplaceable, false);
  });

  it('maps true to empty component', () => {
    expectComponent(createReplaceable, true, 'minecraft:replaceable', {});
  });
});
