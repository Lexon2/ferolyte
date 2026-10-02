import { ClientEntityBuilder } from './client-entity-builder';
import { ClientEntityConfig } from './interfaces/client-entity-config';
import { deepMerge } from '@ferolyte/common/object/deep-merge';

export const createClientEntity = (
  config: ClientEntityConfig,
  ...rest: (Partial<ClientEntityConfig> | ClientEntityBuilder)[]
) => {
  let merged: any = {};
  for (const source of [config, ...rest]) {
    if (source instanceof ClientEntityBuilder) {
      merged = deepMerge(merged, source.cloneConfig());
    } else {
      merged = deepMerge(merged, source);
    }
  }

  return new ClientEntityBuilder(merged);
};
