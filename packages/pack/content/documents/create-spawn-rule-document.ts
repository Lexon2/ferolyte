import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** Spawn rule document, escape hatch: the config mirrors the JSON file in camelCase (generated from the schemas). Prefer `createSpawnRule`. */
export const createSpawnRuleDocument = (
  config: Partial<DocumentConfigs['spawnRule']>,
): DocumentBuilder<'spawnRule'> => new DocumentBuilder('spawnRule', config);
