import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { afterAll, describe, expect, it } from 'vitest';

import { collectDiagnostics } from '@ferolyte/cli/compiler/check/diagnostics-collector';

/**
 * Every titled ```ts block of the docs (a preceding line names its file, e.g. `packs/BP/recipes/x.recipe.ts`)
 * must type-check against the SDK and build without errors; a following "Output:" ```json block must equal the build output.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../../..');
const RUNTIME_DIR = path.join(here, '__examples__');
const DOCS = ['packages/pack/AGENTS.md', 'packages/pack/README.md', 'README.md'];

interface Example {
  doc: string;
  file: string;
  code: string;
  expected?: unknown;
}

const extract = (doc: string): Example[] => {
  const lines = readFileSync(path.join(ROOT, doc), 'utf8').split(/\r?\n/);
  const out: Example[] = [];
  const blockAt = (start: number) => {
    const end = lines.findIndex((l, i) => i > start && l.startsWith('```'));

    return { body: lines.slice(start + 1, end).join('\n'), end };
  };
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '```ts') continue;
    const { body, end } = blockAt(i);
    // The title is on one of the previous lines, up to the previous block or heading.
    let file: string | undefined;
    for (let j = i - 1; j >= 0 && i - j <= 4; j--) {
      if (lines[j].startsWith('```')) break;
      const match = /`(packs\/[^`]+\.ts)`/.exec(lines[j]);
      if (match) {
        file = match[1];
        break;
      }
    }
    if (file === undefined) continue;
    const example: Example = { doc, file, code: body };
    let k = end + 1;
    while (lines[k] === '') k++;
    if (lines[k] === 'Output:') {
      k++;
      while (lines[k] === '') k++;
      if (lines[k] === '```json') {
        example.expected = JSON.parse(blockAt(k).body);
      }
    }
    out.push(example);
  }

  return out;
};

const examples = DOCS.flatMap(extract).map((example, index) => ({
  ...example,
  id: `${String(index).padStart(2, '0')}-${path.basename(example.file)}`,
}));

const typeErrors = (): Map<string, string[]> => {
  const configPath = path.join(ROOT, 'packages/pack/tsconfig.json');
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(configPath, ts.sys.readFile).config,
    ts.sys,
    path.dirname(configPath),
  );
  const options: ts.CompilerOptions = {
    ...parsed.options,
    noEmit: true,
    rootDir: ROOT,
    skipLibCheck: true,
    baseUrl: path.join(ROOT, 'packages/pack'),
    paths: {
      '@ferolyte/pack': ['./index.ts'],
      '@ferolyte/pack/*': ['./*'],
      '@ferolyte/common/*': ['../common/*'],
    },
  };
  const virtual = new Map(
    examples.map((e) => [path.resolve(here, `virtual-${e.id}`), e.code]),
  );
  const host = ts.createCompilerHost(options);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  host.readFile = (name) => virtual.get(path.resolve(name)) ?? readFile(name);
  host.fileExists = (name) => virtual.has(path.resolve(name)) || fileExists(name);
  const program = ts.createProgram([...virtual.keys()], options, host);
  const out = new Map<string, string[]>();
  for (const [file] of virtual) {
    const diagnostics = ts.getPreEmitDiagnostics(program, program.getSourceFile(file));
    out.set(
      path.basename(file).replace('virtual-', ''),
      diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' ')),
    );
  }

  return out;
};

afterAll(() => rmSync(RUNTIME_DIR, { recursive: true, force: true }));

describe('documentation examples', () => {
  it('finds the examples of every content type', () => {
    const files = examples.map((e) => e.file).join('\n');
    for (const suffix of ['.item.ts', '.block.ts', '.se.ts', '.ce.ts', '.att.ts', '.rc.ts', '.recipe.ts', '.spawn.ts']) {
      expect(files).toContain(suffix);
    }
  });

  const errors = typeErrors();
  mkdirSync(RUNTIME_DIR, { recursive: true });

  for (const example of examples) {
    it(`${example.doc}: ${example.file} compiles and builds`, async () => {
      expect(errors.get(example.id)).toEqual([]);

      // Runtime: the package alias points at the sources through the root barrel.
      const file = path.join(RUNTIME_DIR, example.id);
      writeFileSync(
        file,
        example.code.replace(/from '@ferolyte\/pack'/g, "from '@ferolyte/pack/index'"),
      );
      const exported = (await import(/* @vite-ignore */ file)).default;
      const builders: any[] = Array.isArray(exported) ? exported : [exported];

      // The compiler clones every config (`cloneConfig()`): bare Molang values must survive it.
      for (const b of builders) {
        expect(() => b.cloneConfig?.()).not.toThrow();
      }

      const collector = collectDiagnostics({ silent: true });
      const outputs: unknown[] = [];
      const Grouped = builders[0]?.constructor;
      if (builders.length > 1 && typeof Grouped?.buildFile === 'function') {
        for (const b of builders) {
          b.withBuildContext?.({ diagnostics: true, sourceFile: example.file });
        }
        outputs.push(Grouped.buildFile(builders));
      } else {
        for (const b of builders) {
          b.withBuildContext?.({ diagnostics: true, sourceFile: example.file });
          outputs.push(b.build());
        }
      }
      collector.stop();

      expect(
        collector.records.filter((r) => r.severity === 'error'),
      ).toEqual([]);
      if (example.expected !== undefined) {
        expect(JSON.parse(JSON.stringify(outputs[0]))).toEqual(example.expected);
      }
    });
  }
});
