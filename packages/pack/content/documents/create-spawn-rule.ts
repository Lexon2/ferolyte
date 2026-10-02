import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** SpawnRule document (config mirrors the JSON file in camelCase; generated from the schemas, no sugar yet). */
export const createSpawnRule = (
  config: Partial<DocumentConfigs['spawnRule']>,
): DocumentBuilder<'spawnRule'> => new DocumentBuilder('spawnRule', config);
