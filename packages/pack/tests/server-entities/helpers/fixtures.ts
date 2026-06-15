import { ServerEntityConfig } from '@ferolyte/pack/content/server-entity/interfaces/server-entity-config';

export const minimalServerEntityConfig = (
  overrides: Partial<ServerEntityConfig> = {},
): ServerEntityConfig => ({
  identifier: 'test:entity',
  ...overrides,
});
