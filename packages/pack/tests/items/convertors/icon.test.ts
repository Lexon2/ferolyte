import { describe, it } from 'vitest';
import { createIcon } from '@ferolyte/pack/content/item/convertors/components/icon';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createIcon', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createIcon);
  });

  it('returns undefined for empty string', () => {
    expectUndefined(createIcon, '');
  });

  it('maps string icon texture key', () => {
    expectComponent(createIcon, 'ferolyte:test', 'minecraft:icon', {
      textures: { default: 'ferolyte:test' },
    });
  });

  it('maps textures object with atlas keys', () => {
    expectComponent(
      createIcon,
      {
        textures: {
          default: 'ferolyte:test',
          damaged: 'ferolyte:test_damaged',
        },
      },
      'minecraft:icon',
      {
        textures: {
          default: 'ferolyte:test',
          damaged: 'ferolyte:test_damaged',
        },
      },
    );
  });
});
