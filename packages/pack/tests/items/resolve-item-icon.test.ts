import { describe, expect, it } from 'vitest';
import {
  createDefaultItemTexturePath,
  normalizeTexturePath,
  resolveItemIcon,
} from '@artifex/pack/content/item/utils/resolve-item-icon';

describe('normalizeTexturePath', () => {
  it('removes .png suffix', () => {
    expect(normalizeTexturePath('textures/items/stone.png')).toBe(
      'textures/items/stone',
    );
  });

  it('keeps paths without extension unchanged', () => {
    expect(normalizeTexturePath('textures/arfex/test/items/test')).toBe(
      'textures/arfex/test/items/test',
    );
  });
});

describe('createDefaultItemTexturePath', () => {
  it('builds path from namespace and identifier name part', () => {
    expect(createDefaultItemTexturePath('artifex:test', 'arfex_test')).toBe(
      'textures/arfex/test/items/test',
    );
  });
});

describe('resolveItemIcon', () => {
  const packConfig = { namespace: 'arfex_test' };

  it('uses explicit texture path with identifier as atlas key', () => {
    expect(
      resolveItemIcon(
        'textures/arfex/test/items/test',
        'artifex:test',
        packConfig,
      ),
    ).toEqual({
      textureEntries: [
        {
          key: 'artifex:test',
          textures: 'textures/arfex/test/items/test',
        },
      ],
      iconTextures: { default: 'artifex:test' },
    });
  });

  it('uses auto path when icon equals identifier', () => {
    expect(resolveItemIcon('artifex:test', 'artifex:test', packConfig)).toEqual(
      {
        textureEntries: [
          {
            key: 'artifex:test',
            textures: 'textures/arfex/test/items/test',
          },
        ],
        iconTextures: { default: 'artifex:test' },
      },
    );
  });

  it('registers multiple atlas entries for texture variants', () => {
    expect(
      resolveItemIcon(
        {
          textures: {
            default: 'textures/arfex/test/items/test',
            damaged: 'textures/arfex/test/items/test_damaged.png',
          },
        },
        'artifex:test',
        packConfig,
      ),
    ).toEqual({
      textureEntries: [
        {
          key: 'artifex:test',
          textures: 'textures/arfex/test/items/test',
        },
        {
          key: 'artifex:test_damaged',
          textures: 'textures/arfex/test/items/test_damaged',
        },
      ],
      iconTextures: {
        default: 'artifex:test',
        damaged: 'artifex:test_damaged',
      },
    });
  });
});
