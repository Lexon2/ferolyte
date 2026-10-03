import { cloneConfig } from '@ferolyte/common/object/clone-config';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { DocumentConfigs } from '../documents/convert-document';
import { DocumentBuilder } from '../documents/document-builder';
import type {
  RecipeConfig,
  RecipeItem,
  RecipeType,
  RecipeUnlock,
} from './recipe-types';

type RecipeDocumentConfig = Partial<DocumentConfigs['recipe']>;

const DEFAULT_TAGS: Record<RecipeType, string> = {
  shaped: 'crafting_table',
  shapeless: 'crafting_table',
  furnace: 'furnace',
  brewingMix: 'brewing_stand',
  brewingContainer: 'brewing_stand',
  smithingTransform: 'smithing_table',
  smithingTrim: 'smithing_table',
};

const IDENTIFIER = /^[a-z0-9_.-]+:[a-z0-9_./-]+$/;

/** `'ns:item:2'` → `{ item: 'ns:item', data: 2 }`; other shorthands stay as written. */
export const normalizeRecipeItem = (item: RecipeItem): RecipeItem => {
  if (typeof item !== 'string') {
    return item;
  }
  const match = /^([^:\s]+:[^:\s]+):(\d+)$/.exec(item);

  return match ? { item: match[1], data: Number(match[2]) } : item;
};

const normalizeResult = (result: RecipeItem | RecipeItem[]) =>
  Array.isArray(result)
    ? result.map(normalizeRecipeItem)
    : normalizeRecipeItem(result);

const normalizeUnlock = (unlock: RecipeUnlock | undefined) => {
  if (unlock === undefined) {
    return undefined;
  }
  if (typeof unlock === 'string') {
    // A context keyword, or a single item.
    return /^[A-Z][A-Za-z]+$/.test(unlock)
      ? { context: unlock }
      : [asObject(normalizeRecipeItem(unlock))];
  }
  if (Array.isArray(unlock)) {
    return unlock.map((item) => asObject(normalizeRecipeItem(item)));
  }

  return [asObject(normalizeRecipeItem(unlock))];
};

/** Unlock entries must be objects (`{ item }` / `{ tag }`). */
const asObject = (item: RecipeItem) =>
  typeof item === 'string' ? { item } : item;

const isTag = (item: RecipeItem): boolean =>
  typeof item === 'object' && 'tag' in item;

const idOf = (item: RecipeItem): string | undefined =>
  typeof item === 'string'
    ? item
    : 'item' in item
      ? item.item
      : undefined;

/** Config of the generated recipe document for one flat recipe config. */
export const toRecipeDocument = (config: RecipeConfig): RecipeDocumentConfig => {
  const base = {
    description: { identifier: config.identifier },
    tags: config.tags ?? [DEFAULT_TAGS[config.type]],
    unlock: normalizeUnlock(config.unlock),
  };
  const formatVersion = config.version;
  const wrap = (key: keyof DocumentConfigs['recipe'], body: object) =>
    ({
      ...(formatVersion !== undefined ? { formatVersion } : {}),
      [key]: body,
    }) as RecipeDocumentConfig;

  switch (config.type) {
    case 'shaped':
      return wrap('shaped', {
        ...base,
        pattern: config.pattern,
        key: Object.fromEntries(
          Object.entries(config.key).map(([symbol, item]) => [
            symbol,
            normalizeRecipeItem(item),
          ]),
        ),
        result: normalizeResult(config.result),
        group: config.group,
        priority: config.priority,
        assumeSymmetry: config.assumeSymmetry,
      });
    case 'shapeless':
      return wrap('shapeless', {
        ...base,
        ingredients: config.ingredients.map(normalizeRecipeItem),
        result: normalizeResult(config.result),
        group: config.group,
        priority: config.priority,
      });
    case 'furnace':
      return wrap('furnace', {
        ...base,
        input: normalizeRecipeItem(config.input),
        output: normalizeRecipeItem(config.output),
        priority: config.priority,
      });
    case 'brewingMix':
    case 'brewingContainer':
      return wrap(config.type, {
        ...base,
        input: config.input,
        reagent: config.reagent,
        output: config.output,
      });
    case 'smithingTransform':
      return wrap('smithingTransform', {
        ...base,
        template: normalizeRecipeItem(config.template),
        base: normalizeRecipeItem(config.base),
        addition: normalizeRecipeItem(config.addition),
        result: normalizeResult(config.result),
      });
    case 'smithingTrim':
      return wrap('smithingTrim', {
        ...base,
        template: normalizeRecipeItem(config.template),
        base: normalizeRecipeItem(config.base),
        addition: normalizeRecipeItem(config.addition),
      });
  }
};

/** Recipe with SDK sugar: item shorthands, default station tags and structural checks. */
export class RecipeBuilder extends DocumentBuilder<'recipe'> {
  constructor(private readonly flat: RecipeConfig) {
    super('recipe', toRecipeDocument(flat));
  }

  /** The flat config the recipe was created from. */
  public cloneFlatConfig(): RecipeConfig {
    return cloneConfig(this.flat);
  }

  public override build(): Record<string, unknown> {
    this.check();

    return super.build();
  }

  private error(fieldPath: string, message: string) {
    const ctx: ContentDiagnosticContext | undefined = this.buildContext && {
      ...this.buildContext,
      identifier: this.flat.identifier,
      fieldPath,
    };
    logContentError(ctx, message);
  }

  private check() {
    const recipe = this.flat;
    if (!IDENTIFIER.test(recipe.identifier ?? '')) {
      this.error(
        'identifier',
        `Recipe identifier must be "namespace:name" (lowercase), got "${String(recipe.identifier)}"`,
      );
    }
    if (recipe.type === 'shaped') {
      this.checkPattern(recipe);
    }
    if ('result' in recipe) {
      const results = Array.isArray(recipe.result)
        ? recipe.result
        : [recipe.result];
      if (
        results.length === 0 ||
        results.some(
          (result) => !isTag(result) && !idOf(result),
        )
      ) {
        this.error('result', 'Recipe result is empty');
      }
      if (results.some(isTag)) {
        this.error('result', 'A recipe result must be an item, not a tag');
      }
    }
    if (recipe.type === 'shapeless' && recipe.ingredients.length === 0) {
      this.error('ingredients', 'A shapeless recipe needs at least one ingredient');
    }
    if (recipe.type === 'shapeless' && recipe.ingredients.length > 9) {
      this.error(
        'ingredients',
        `A shapeless crafting recipe holds up to 9 ingredients, got ${recipe.ingredients.length}`,
      );
    }
  }

  private checkPattern(recipe: Extract<RecipeConfig, { type: 'shaped' }>) {
    const { pattern, key } = recipe;
    if (pattern.length === 0 || pattern.length > 3) {
      this.error('pattern', `Pattern must have 1 to 3 rows, got ${pattern.length}`);
    }
    pattern.forEach((row, index) => {
      if (row.length === 0 || row.length > 3) {
        this.error(
          `pattern[${index}]`,
          `Pattern rows are 1 to 3 symbols wide, "${row}" has ${row.length}`,
        );
      }
    });

    const defined = new Set(Object.keys(key));
    for (const symbol of defined) {
      if (symbol.length !== 1 || symbol === ' ') {
        this.error(
          `key.${symbol}`,
          `Key "${symbol}" must be a single character other than a space (a space is an empty slot)`,
        );
      }
    }
    const used = new Set<string>();
    pattern.forEach((row, index) => {
      for (const symbol of row) {
        if (symbol === ' ') {
          continue;
        }
        used.add(symbol);
        if (!defined.has(symbol)) {
          this.error(
            `pattern[${index}]`,
            `Pattern symbol "${symbol}" is not defined in key`,
          );
        }
      }
    });
    for (const symbol of defined) {
      if (!used.has(symbol)) {
        this.error(`key.${symbol}`, `Key "${symbol}" is not used in the pattern`);
      }
    }
  }
}
