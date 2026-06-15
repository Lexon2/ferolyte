import { describe, it } from 'vitest';
import { createDyeable } from '@ferolyte/pack/content/item/convertors/components/dyeable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDyeable', () => {
  it('returns empty dyeable for empty options', () => {
    expectComponent(createDyeable, {}, 'minecraft:dyeable', {});
  });

  it('returns undefined for invalid hex', () => {
    expectUndefined(createDyeable, { defaultColor: 'red' });
  });

  it('maps hex color', () => {
    expectComponent(
      createDyeable,
      { defaultColor: '#ff0000' },
      'minecraft:dyeable',
      { default_color: '#ff0000' },
    );
  });

  it('maps rgb color', () => {
    expectComponent(
      createDyeable,
      { defaultColor: [255, 0, 0] },
      'minecraft:dyeable',
      { default_color: [255, 0, 0] },
    );
  });
});
