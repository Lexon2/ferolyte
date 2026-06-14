import { ServerEntityConfig } from './interfaces/server-entity-config';
import { ServerEntityBuilder } from './server-entity-builder';
import { deepMerge } from '@artifex/common/object/deep-merge';

export const createServerEntity = (
  ...sources: (ServerEntityConfig | ServerEntityBuilder)[]
) => {
  let merged: any = {};
  for (const source of sources) {
    if (source instanceof ServerEntityBuilder) {
      merged = deepMerge(merged, source.cloneConfig());
    } else {
      merged = deepMerge(merged, source);
    }
  }

  return new ServerEntityBuilder(merged);
};
