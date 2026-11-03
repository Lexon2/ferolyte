import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { build } from 'esbuild';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { jsoncEsbuildPlugin } from '../core/utils/jsonc-esbuild-plugin';
import { copyWithPlugins } from '../plugins/write-with-plugins';
import { parse } from 'jsonc-parser';

import { parseJsonc, readJsonc } from './read-jsonc';

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

  it('parseJsonc gives the jsonc-parser value for strict JSON (native fast path)', () => {
    const backslash = String.fromCharCode(92);
    const texts = [
      '{"b":1,"a":{"c":[1,2.5,-0,1e400,null,true]},"b":3}',
      JSON.stringify({ 2: 'x', 1: 'y', z: 'A/' + String.fromCharCode(10, 9, 34, 92), u: String.fromCodePoint(233, 0x1f600) }),
      '[1.0, 1.50, 1e2, -1E-2, 123456789012345678901234567890]',
      '"' + backslash + 'ud800 ' + backslash + 'u0041' + backslash + '/"',
    ];
    for (const text of texts) {
      const result = parseJsonc(text);
      expect(result.ok).toBe(true);
      const value = result.ok ? result.value : undefined;
      expect(value).toStrictEqual(parse(text, [], { allowTrailingComma: true }));
      expect(JSON.stringify(value)).toBe(JSON.stringify(parse(text, [], { allowTrailingComma: true })));
    }
  });

  it('parseJsonc keeps jsonc-parser semantics for __proto__ keys, comments and errors', () => {
    const proto = parseJsonc('{"__proto__": {"x": 1}, "a": 2}');
    expect(proto.ok && Object.keys(proto.value as object)).toEqual(['a']);
    expect(parseJsonc(COMMENTED)).toEqual({ ok: true, value: { a: 1, b: [1, 2] } });
    const bad = parseJsonc('{"a": 1 "b": 2}');
    expect(bad.ok).toBe(false);
    expect(!bad.ok && bad.errors[0]).toMatchObject({ line: 1, message: 'CommaExpected' });
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
