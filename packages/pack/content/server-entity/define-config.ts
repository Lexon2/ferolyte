
import { ServerEntityConfig } from './interfaces/server-entity-config';
import type { EntityChecks } from './typed-entity';

export const defineServerEntityConfig = <C extends ServerEntityConfig>(
  config: C,
) => config;

/**
 * Declares a server entity config with literal-typed names (no `as const` needed):
 * events, component groups and properties declared here are checked where they are referenced.
 * Pass the result to `createServerEntity`, `props()` and `PropertiesOf<>`.
 */
export const defineServerEntity = <const C extends ServerEntityConfig>(
  config: C & EntityChecks<C>,
): C => config;
