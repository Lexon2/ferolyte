import { describe, it } from 'vitest';
import { createSwingDuration } from '@ferolyte/pack/content/item/convertors/components/swing-duration';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createSwingDuration', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createSwingDuration);
  });

  it('returns undefined for negative value', () => {
    expectUndefined(createSwingDuration, { value: -1 });
  });

  it('maps swing duration', () => {
    expectComponent(
      createSwingDuration,
      { value: 6 },
      'minecraft:swing_duration',
      { value: 6 },
    );
  });
});
