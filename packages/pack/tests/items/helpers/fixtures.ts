import { ItemConfig } from '@artifex/pack/content/item/interfaces/item-config';

export const minimalItemConfig = (
  overrides: Partial<ItemConfig> = {},
): ItemConfig => ({
  identifier: 'test:item',
  ...overrides,
});
