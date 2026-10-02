import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** Recipe document (config mirrors the JSON file in camelCase; generated from the schemas, no sugar yet). */
export const createRecipe = (
  config: Partial<DocumentConfigs['recipe']>,
): DocumentBuilder<'recipe'> => new DocumentBuilder('recipe', config);
