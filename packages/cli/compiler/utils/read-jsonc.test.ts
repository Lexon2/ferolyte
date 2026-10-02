import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { build } from 'esbuild';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { jsoncEsbuildPlugin } from '../core/utils/jsonc-esbuild-plugin';
import { copyWithPlugins } from '../plugins/write-with-plugins';
import { readJsonc } from './read-jsonc';

const roots: string[] = [];

const createRoot = async (): Promise<string> => {
  const root = join(
    tmpdir(),
    `ferolyte-jsonc-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  await mkdir(root, { recursive: true });
  roots.push(root);
  return root;
};

const COMMENTED = '// head\n{\n  /* a */ "a": 1,\n  "b": [1, 2,],\n}\n';

afterEach(async () => {
  vi.restoreAllMocks();
  BUILD_CONTEXT.PACKS.MINIFY_JSON = false;
  await Promise.all(
    roots.splice(0).map((r) => rm(r, { recursive: true, force: true })),
  );
});

describe('jsonc', () => {
  it('readJsonc parses comments and trailing commas', async () => {
    const root = await createRoot();
    await writeFile(join(root, 'a.json'), COMMENTED);
    expect(await readJsonc(join(root, 'a.json'))).toEqual({ a: 1, b: [1, 2] });
  });

  it('readJsonc reports file:line', async () => {
    const root = await createRoot();
    await writeFile(join(root, 'bad.json'), '{\n  "a": \n');
    await expect(readJsonc(join(root, 'bad.json'))).rejects.toThrow(
      /bad\.json:\d+:\d+/,
    );
  });

  it('esbuild plugin lets a .ts import commented JSON', async () => {
    const root = await createRoot();
    await writeFile(join(root, 'data.json'), COMMENTED);
    await writeFile(
      join(root, 'entry.ts'),
      "import data from './data.json';\nexport default data;\n",
    );
    const result = await build({
      entryPoints: [join(root, 'entry.ts')],
      bundle: true,
      write: false,
      format: 'esm',
      plugins: [jsoncEsbuildPlugin()],
    });
    expect(result.outputFiles[0].text).toContain('{ a: 1, b: [1, 2] }');
  });

  it('esbuild plugin reports invalid JSON with location', async () => {
    const root = await createRoot();
    await writeFile(join(root, 'data.json'), '{\n  "a": \n');
    await writeFile(
      join(root, 'entry.ts'),
      "import data from './data.json';\nexport default data;\n",
    );
    await expect(
      build({
        entryPoints: [join(root, 'entry.ts')],
        bundle: true,
        write: false,
        logLevel: 'silent',
        plugins: [jsoncEsbuildPlugin()],
      }),
    ).rejects.toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({
          location: expect.objectContaining({
            file: expect.stringMatching(/data\.json$/),
            line: expect.any(Number),
          }),
        }),
      ]),
    });
  });

  it('copy re-serializes commented JSON without comments', async () => {
    const root = await createRoot();
    await writeFile(join(root, 'in.json'), COMMENTED);
    await copyWithPlugins(join(root, 'in.json'), join(root, 'out.json'));
    const out = await readFile(join(root, 'out.json'), 'utf-8');
    expect(JSON.parse(out)).toEqual({ a: 1, b: [1, 2] });
    expect(out).not.toContain('//');
    expect(out).toContain('\n  ');
  });

  it('copy minifies when MINIFY_JSON is set', async () => {
    const root = await createRoot();
    BUILD_CONTEXT.PACKS.MINIFY_JSON = true;
    await writeFile(join(root, 'in.json'), COMMENTED);
    await copyWithPlugins(join(root, 'in.json'), join(root, 'out.json'));
    expect(await readFile(join(root, 'out.json'), 'utf-8')).toBe(
      '{"a":1,"b":[1,2]}',
    );
  });

  it('copy keeps invalid JSON as is and warns', async () => {
    const root = await createRoot();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await writeFile(join(root, 'in.json'), '{\n "a": \n');
    await copyWithPlugins(join(root, 'in.json'), join(root, 'out.json'));
    expect(await readFile(join(root, 'out.json'), 'utf-8')).toBe('{\n "a": \n');
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/in\.json:\d+/));
  });
});
