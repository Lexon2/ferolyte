import { mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
import { BUILD_CONTEXT } from '../build-context';
import { buildContentJson } from '../content/content.factory';
import { buildContentSuffixRegistry } from '../content/utils/content-suffix-registry';
import { reformatJson } from '../utils/reformat-json';
import { initPlugins } from './plugin-host';
import { copyWithPlugins } from './write-with-plugins';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-write-'));
  initPlugins([], 'test');
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
});

afterEach(async () => {
  BUILD_CONTEXT.PACKS.MINIFY_JSON = false;
  await rm(root, { recursive: true, force: true });
});

const buildEntity = async () => {
  const result = await buildContentJson(
    join(root, 'src', 'x.se.ts'),
    {
      default: createServerEntity({
        identifier: 'ns:x',
        properties: {
          'ns:yaw': { type: 'float', range: [-180, 180], default: 0 },
        },
      }),
    },
    { debug: false, diagnostics: false },
  );
  if (result === undefined || result instanceof Error) {
    throw result ?? new Error('not built');
  }

  return readFile(result.outFile[0], 'utf-8');
};

describe('float literals survive every write path', () => {
  it('keeps 0.0 of a float property default with minifyJSON', async () => {
    BUILD_CONTEXT.PACKS.MINIFY_JSON = true;
    const text = await buildEntity();

    expect(text).not.toContain('\n');
    expect(text).toContain('"default":0.0');
    expect(text).toContain('"range":[-180.0,180.0]');
  });

  it('keeps 0.0 without minifyJSON', async () => {
    const text = await buildEntity();

    expect(text).toContain('"default": 0.0');
  });

  it('keeps 1.0 in a copied JSON file, minified or not', async () => {
    const source = join(root, 'in.json');
    await writeFile(source, '{\n  // comment\n  "a": 1.0, "b": [0.50, -2.0e1,],\n  "c": {}, "d": "x,y"\n}\n');

    const pretty = join(root, 'out', 'pretty.json');
    await copyWithPlugins(source, pretty);
    expect(await readFile(pretty, 'utf-8')).toBe(
      '{\n  "a": 1.0,\n  "b": [\n    0.50,\n    -2.0e1\n  ],\n  "c": {},\n  "d": "x,y"\n}',
    );

    BUILD_CONTEXT.PACKS.MINIFY_JSON = true;
    const minified = join(root, 'out', 'min.json');
    await copyWithPlugins(source, minified);
    expect(await readFile(minified, 'utf-8')).toBe('{"a":1.0,"b":[0.50,-2.0e1],"c":{},"d":"x,y"}');
  });
});

describe('reformatJson', () => {
  it('matches JSON.stringify layout for JSON without floats', () => {
    const value = { a: [1, { b: 'c' }, []], d: {}, e: null, f: true, g: 'q"\\' };
    const text = JSON.stringify(value);

    expect(reformatJson(text, 2)).toBe(JSON.stringify(value, null, 2));
    expect(reformatJson(JSON.stringify(value, null, 4))).toBe(text);
  });
});
