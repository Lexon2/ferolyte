import { readdir, readFile } from 'fs/promises';
import { basename, dirname, join, resolve } from 'path';

import {
  LocalizedString,
  toTranslations,
} from '@ferolyte/common/content/localization/localized-string';
import { BUILD_CONTEXT } from '../build-context';
import { replaceContentOutputs } from '../content/utils/content-output-registry';
import { writeWithPlugins } from '../plugins/write-with-plugins';
import { mergeLang } from './lang-file';
import { logger } from '../utils/logger';

export interface LangEntry {
  key: string;
  /** `locale -> text`. */
  translations: Record<string, string>;
}

export interface LangStats {
  /** Written `<locale>.lang` files. */
  locales: number;
  /** Distinct generated keys. */
  keys: number;
}

let lastStats: LangStats = { locales: 0, keys: 0 };

/** Numbers of the last `flushLang`. */
export const getLangStats = (): LangStats => ({ ...lastStats });

/** Pseudo source under which the generated `.lang` outputs are registered. */
export const LANG_OUTPUT_SOURCE = 'ferolyte:lang';

const entriesBySource = new Map<string, LangEntry[]>();
const pendingBySource = new Map<string, LangEntry[]>();
let dirty = false;

export const clearAllLang = (): void => {
  entriesBySource.clear();
  pendingBySource.clear();
  dirty = true;
};

/**
 * Starts collecting lang entries of a source file. The previous entries stay
 * active until `commitSourceLang`, so a failed build keeps the old keys.
 */
export const beginSourceLang = (source: string): void => {
  pendingBySource.set(source, []);
};

export const addSourceLang = (
  source: string,
  key: string,
  text: LocalizedString | undefined,
): void => {
  if (text === undefined) {
    return;
  }

  pendingBySource.get(source)?.push({
    key,
    translations: toTranslations(text, BUILD_CONTEXT.PACKS.LANG.DEFAULT_LOCALE),
  });
};

export const commitSourceLang = (source: string): void => {
  const pending = pendingBySource.get(source);
  pendingBySource.delete(source);
  if (pending === undefined) {
    return;
  }

  if (pending.length > 0) {
    entriesBySource.set(source, pending);
  } else {
    entriesBySource.delete(source);
  }
  dirty = true;
};

export const removeSourceLang = (source: string): void => {
  pendingBySource.delete(source);
  if (entriesBySource.delete(source)) {
    dirty = true;
  }
};

export const getSourceLang = (source: string): readonly LangEntry[] =>
  entriesBySource.get(source) ?? [];

/** Marks the lang output as stale (user `.lang` / `languages.json` changed). */
export const markLangDirty = (): void => {
  dirty = true;
};

/** User `texts/*.lang` and `texts/languages.json` are handled by the generator, not copied. */
export const isLangInput = (filePath: string): boolean =>
  resolve(dirname(filePath)) ===
    resolve(BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH, 'texts') &&
  (filePath.endsWith('.lang') || basename(filePath) === 'languages.json');

const readOptional = async (path: string): Promise<string | undefined> => {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return undefined;
  }
};

const readUserLocales = async (inputTexts: string): Promise<string[]> => {
  try {
    return (await readdir(inputTexts))
      .filter((name) => name.endsWith('.lang'))
      .map((name) => name.slice(0, -'.lang'.length));
  } catch {
    return [];
  }
};

const readUserLanguages = async (path: string): Promise<string[]> => {
  const text = await readOptional(path);
  if (text === undefined) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(text);

    return Array.isArray(parsed)
      ? parsed.filter((locale): locale is string => typeof locale === 'string')
      : [];
  } catch {
    return [];
  }
};

/**
 * Builds `texts/<locale>.lang` and `texts/languages.json` from the registered
 * entries merged with the user's `texts/*.lang`. Outputs are registered so that
 * files that are no longer needed get removed.
 * @returns Written output paths.
 */
export const flushLang = async (options?: {
  force?: boolean;
}): Promise<string[]> => {
  if (!dirty && !options?.force) {
    return [];
  }
  dirty = false;

  const { DEFAULT_LOCALE, LOCALES } = BUILD_CONTEXT.PACKS.LANG;
  const inputTexts = join(
    BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH,
    'texts',
  );
  const outputTexts = join(
    BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH,
    'texts',
  );
  const entries = [...entriesBySource.values()].flat();

  const locales = new Set<string>(await readUserLocales(inputTexts));
  if (entries.length > 0) {
    LOCALES.forEach((locale) => locales.add(locale));
    for (const { translations } of entries) {
      Object.keys(translations).forEach((locale) => locales.add(locale));
    }
  }

  const outputs: string[] = [];
  const write = async (outFile: string, text: string) => {
    const result = await writeWithPlugins(
      LANG_OUTPUT_SOURCE,
      outFile,
      text,
      'content',
      'utf-8',
    );
    if (result.written) {
      outputs.push(result.destinationPath);
    }
  };

  for (const locale of [...locales].sort()) {
    const generated = new Map<string, string>();
    for (const { key, translations } of entries) {
      const text =
        translations[locale] ??
        translations[DEFAULT_LOCALE] ??
        Object.values(translations)[0];
      if (text !== undefined && !generated.has(key)) {
        generated.set(key, text);
      }
    }

    const userText = await readOptional(join(inputTexts, `${locale}.lang`));
    const { text, conflicts } = mergeLang(userText, generated);
    for (const key of conflicts) {
      logger.warn(
        `⚠ texts/${locale}.lang  "${key}" is defined there, generated value ignored`,
      );
    }
    if (text.length > 0) {
      await write(join(outputTexts, `${locale}.lang`), text);
    }
  }

  const languages = [
    ...new Set([
      ...(await readUserLanguages(join(inputTexts, 'languages.json'))),
      ...[...locales].sort(),
    ]),
  ];
  if (languages.length > 0) {
    await write(
      join(outputTexts, 'languages.json'),
      `${JSON.stringify(languages, null, 2)}\n`,
    );
  }

  lastStats = {
    locales: outputs.filter((output) => output.endsWith('.lang')).length,
    keys: new Set(entries.map((entry) => entry.key)).size,
  };

  await replaceContentOutputs(LANG_OUTPUT_SOURCE, outputs);

  return outputs;
};
