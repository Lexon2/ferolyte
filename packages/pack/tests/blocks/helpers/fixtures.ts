import { BlockConfig } from '@ferolyte/pack/content/block/interfaces/block-config';

export const minimalBlockConfig = (
  overrides: Partial<BlockConfig> = {},
): BlockConfig => ({
  identifier: 'test:block',
  ...overrides,
});

export const validItemVisual = {
  geometry: 'geometry.test.block',
  materialInstances: {
    '*': 'texture.test.block',
  },
};
