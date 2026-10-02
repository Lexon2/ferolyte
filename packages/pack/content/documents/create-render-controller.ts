import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** RenderController document (config mirrors the JSON file in camelCase; generated from the schemas, no sugar yet). */
export const createRenderController = (
  config: Partial<DocumentConfigs['renderController']>,
): DocumentBuilder<'renderController'> => new DocumentBuilder('renderController', config);
