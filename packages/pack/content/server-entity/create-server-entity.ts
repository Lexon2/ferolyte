import { ServerEntityConfig } from './interfaces/server-entity-config';
import { ServerEntityBuilder } from './server-entity-builder';
import { deepMerge } from '@ferolyte/common/object/deep-merge';

/**
 * Creates a server entity. Accepts wide types (helpers returning `EntityComponentGroup`,
 * `EntityEventNode`, `string` event names). For literal-typed checks of events, component
 * groups and properties, declare the config with `defineServerEntity` and pass it here.
 */
export const createServerEntity = (
  config: ServerEntityConfig,
  ...rest: (Partial<ServerEntityConfig> | ServerEntityBuilder)[]
) => {
  let merged: any = {};
  for (const source of [config, ...rest]) {
    if (source instanceof ServerEntityBuilder) {
      merged = deepMerge(merged, source.cloneConfig());
    } else {
      merged = deepMerge(merged, source);
    }
  }

  return new ServerEntityBuilder(merged);
};
