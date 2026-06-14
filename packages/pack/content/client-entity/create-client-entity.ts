import { ClientEntityBuilder } from './client-entity-builder';
import { ClientEntityConfig } from './interfaces/client-entity-config';
import { deepMerge } from '@artifex/common/object/deep-merge';

export const createClientEntity = (
  ...sources: (ClientEntityConfig | ClientEntityBuilder)[]
) => {
  let merged: any = {};
  for (const source of sources) {
    if (source instanceof ClientEntityBuilder) {
      merged = deepMerge(merged, source.cloneConfig());
    } else {
      merged = deepMerge(merged, source);
    }
  }

  return new ClientEntityBuilder(merged);
};
