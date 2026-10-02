import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** Attachable document (config mirrors the JSON file in camelCase; generated from the schemas, no sugar: escape hatch of `createAttachable`). */
export const createAttachableDocument = (
  config: Partial<DocumentConfigs['attachable']>,
): DocumentBuilder<'attachable'> => new DocumentBuilder('attachable', config);
