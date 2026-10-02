import type { DocumentConfigs } from './convert-document';
import { DocumentBuilder } from './document-builder';

/** Recipe document, escape hatch: the config mirrors the JSON file in camelCase (generated from the schemas). Prefer `createRecipe` and the typed helpers. */
export const createRecipeDocument = (
  config: Partial<DocumentConfigs['recipe']>,
): DocumentBuilder<'recipe'> => new DocumentBuilder('recipe', config);
