import { ItemConfig } from './interfaces/item-config';
import { ItemBuilder } from './item-builder';
import { deepMerge } from '@ferolyte/common/object/deep-merge';

export const createItem = (
  config: ItemConfig,
  ...rest: (Partial<ItemConfig> | ItemBuilder)[]
) => {
  let merged: any = {};
  for (const source of [config, ...rest]) {
    if (source instanceof ItemBuilder) {
      merged = deepMerge(merged, source.cloneConfig());
    } else {
      merged = deepMerge(merged, source);
    }
  }

  return new ItemBuilder(merged);
};
