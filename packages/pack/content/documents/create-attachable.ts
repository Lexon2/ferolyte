import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** Attachable document (config mirrors the JSON file in camelCase; generated from the schemas, no sugar yet). */
export const createAttachable = (
  config: Partial<DocumentConfigs['attachable']>,
): DocumentBuilder<'attachable'> => new DocumentBuilder('attachable', config);
