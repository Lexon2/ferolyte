import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { clearAllContentOutputs } from '../content/utils/content-output-registry';
import {
  addSourceLang,
  beginSourceLang,
  clearAllLang,
  commitSourceLang,
  flushLang,
  isLangInput,
  removeSourceLang,
} from './lang-registry';

let root: string;

const register = (source: string, key: string, text: string | Record<string, string>) => {
  beginSourceLang(source);
  addSourceLang(source, key, text);
  commitSourceLang(source);
};

const out = (name: string) => join(root, 'out/RP/texts', name);

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-lang-'));
  await mkdir(join(root, 'in/RP/texts'), { recursive: true });
  BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'in/RP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'out/RP');
  BUILD_CONTEXT.PACKS.LANG = { DEFAULT_LOCALE: 'en_US', LOCALES: [] };
  clearAllLang();
  clearAllContentOutputs();
});

afterEach(async () => {
  clearAllLang();
  await rm(root, { recursive: true, force: true });
});

describe('flushLang', () => {
  it('generates the default locale and languages.json', async () => {
    register('/a.item.ts', 'item.t:a', 'Alpha');
    await flushLang();

    expect(await readFile(out('en_US.lang'), 'utf-8')).toContain('item.t:a=Alpha');
    expect(JSON.parse(await readFile(out('languages.json'), 'utf-8'))).toEqual(['en_US']);
  });

  it('writes translations per locale with default fallback', async () => {
    BUILD_CONTEXT.PACKS.LANG.LOCALES = ['de_DE'];
    register('/a.item.ts', 'item.t:a', { en_US: 'Alpha', ru_RU: 'Альфа' });
    register('/b.item.ts', 'item.t:b', 'Beta');
    await flushLang();

    expect(await readFile(out('ru_RU.lang'), 'utf-8')).toContain('item.t:a=Альфа');
    expect(await readFile(out('ru_RU.lang'), 'utf-8')).toContain('item.t:b=Beta');
    expect(await readFile(out('de_DE.lang'), 'utf-8')).toContain('item.t:a=Alpha');
    expect(JSON.parse(await readFile(out('languages.json'), 'utf-8'))).toEqual([
      'de_DE',
      'en_US',
      'ru_RU',
    ]);
  });

  it('merges with the user lang file and user languages.json', async () => {
    await writeFile(join(root, 'in/RP/texts/en_US.lang'), '## mine\npack.name=Pack\nitem.t:a=User\n');
    await writeFile(join(root, 'in/RP/texts/languages.json'), '["en_US", "fr_FR"]');
    register('/a.item.ts', 'item.t:a', 'Alpha');
    register('/b.item.ts', 'item.t:b', 'Beta');
    await flushLang();

    const text = await readFile(out('en_US.lang'), 'utf-8');
    expect(text.startsWith('## mine\npack.name=Pack\nitem.t:a=User\n')).toBe(true);
    expect(text).not.toContain('Alpha');
    expect(text).toContain('item.t:b=Beta');
    expect(JSON.parse(await readFile(out('languages.json'), 'utf-8'))).toEqual(['en_US', 'fr_FR']);
  });

  it('removes keys and files when the source file is removed', async () => {
    register('/a.item.ts', 'item.t:a', 'Alpha');
    register('/b.item.ts', 'item.t:b', 'Beta');
    await flushLang();

    removeSourceLang('/a.item.ts');
    await flushLang();
    const text = await readFile(out('en_US.lang'), 'utf-8');
    expect(text).not.toContain('Alpha');
    expect(text).toContain('Beta');

    removeSourceLang('/b.item.ts');
    await flushLang();
    expect(existsSync(out('en_US.lang'))).toBe(false);
    expect(existsSync(out('languages.json'))).toBe(false);
  });

  it('keeps old keys while a rebuild has not been committed', async () => {
    register('/a.item.ts', 'item.t:a', 'Alpha');
    beginSourceLang('/a.item.ts');
    await flushLang({ force: true });

    expect(await readFile(out('en_US.lang'), 'utf-8')).toContain('Alpha');
  });
});

describe('isLangInput', () => {
  it('matches only resource pack texts, not behavior pack texts', () => {
    expect(isLangInput(join(root, 'in/RP/texts/en_US.lang'))).toBe(true);
    expect(isLangInput(join(root, 'in/RP/texts/languages.json'))).toBe(true);
    expect(isLangInput(join(root, 'in/BP/texts/en_US.lang'))).toBe(false);
    expect(isLangInput(join(root, 'in/BP/texts/languages.json'))).toBe(false);
  });
});
