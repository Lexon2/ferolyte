
import { ServerEntityConfig } from './interfaces/server-entity-config';

export const defineServerEntityConfig = <C extends ServerEntityConfig>(
  config: C,
) => config;
