import { BlockBuilder } from './block-builder';
import { BlockConfig } from './interfaces/block-config';
import { deepMerge } from '@artifex/common/object/deep-merge';

export const createBlock = (...sources: (BlockConfig | BlockBuilder)[]) => {
  let merged: any = {};
  for (const source of sources) {
    if (source instanceof BlockBuilder) {
      merged = deepMerge(merged, source.cloneConfig());
    } else {
      merged = deepMerge(merged, source);
    }
  }

  return new BlockBuilder(merged);
};
