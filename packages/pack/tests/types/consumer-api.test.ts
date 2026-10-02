import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Compiles "user" snippets against the SDK sources with the TypeScript compiler,
 * so type regressions of the public config API (generated types, SDK sugar,
 * custom components, filters) are caught by the unit tests.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../../..');
const virtualFile = path.join(here, '__consumer-snippet.generated.ts');

const compile = (source: string): string[] => {
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
  };
  const host = ts.createCompilerHost(options);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  host.readFile = (name) =>
    path.resolve(name) === path.resolve(virtualFile) ? source : readFile(name);
  host.fileExists = (name) =>
    path.resolve(name) === path.resolve(virtualFile) || fileExists(name);
  const program = ts.createProgram([virtualFile], options, host);

  return ts
    .getPreEmitDiagnostics(program, program.getSourceFile(virtualFile))
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
};

/** Suggestion diagnostics (deprecations) of a snippet, through the language service. */
const suggestions = (source: string): string[] => {
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
  };
  const host: ts.LanguageServiceHost = {
    getCompilationSettings: () => options,
    getScriptFileNames: () => [virtualFile],
    getScriptVersion: () => '1',
    getScriptSnapshot: (name) => {
      const text =
        path.resolve(name) === path.resolve(virtualFile)
          ? source
          : ts.sys.readFile(name);

      return text === undefined
        ? undefined
        : ts.ScriptSnapshot.fromString(text);
    },
    getCurrentDirectory: () => ROOT,
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    fileExists: (name) =>
      path.resolve(name) === path.resolve(virtualFile) ||
      ts.sys.fileExists(name),
    readFile: (name) =>
      path.resolve(name) === path.resolve(virtualFile)
        ? source
        : ts.sys.readFile(name),
  };
  const service = ts.createLanguageService(host);

  return service
    .getSuggestionDiagnostics(virtualFile)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
};

const header = `
import { createBlock } from '@ferolyte/pack/content/block/create-block';
import { createItem } from '@ferolyte/pack/content/item/create-item';
import { createServerEntity } from '@ferolyte/pack/content/server-entity/create-server-entity';
`;

describe('consumer API types', () => {
  it('block trait aliases and schema names', () => {
    expect(
      compile(`${header}
createBlock({
  identifier: 'a:b',
  traits: {
    placementPosition: { states: ['minecraft:block_face'] },
    placementDirection: { states: ['minecraft:cardinal_direction'], yRotation: 180 },
  },
});
createBlock({
  identifier: 'a:b',
  traits: {
    placementPosition: { enabledStates: ['minecraft:vertical_half'] },
    placementDirection: { enabledStates: ['minecraft:facing_direction'], yRotationOffset: 90 },
    connection: {},
    multiBlock: { enabledStates: ['minecraft:multi_block_part'], direction: 'up', parts: 2 },
  },
});
`),
    ).toEqual([]);
  });

  it('custom components of blocks, permutations and items', () => {
    expect(
      compile(`${header}
createBlock({
  identifier: 'a:b',
  components: { 'a:custom': { x: 1 }, friction: 0.5 },
  permutations: [{ condition: { query: 'q.x' }, components: { 'a:custom': {} } }],
});
createItem({ identifier: 'a:i', components: { 'a:custom': { x: 1 }, maxStackSize: 16 } });
`),
    ).toEqual([]);
  });

  it('every filter subject', () => {
    const subjects = [
      'baby',
      'block',
      'damager',
      'other',
      'parent',
      'player',
      'self',
      'target',
    ];

    expect(
      compile(`${header}
${subjects
  .map(
    (subject, i) =>
      `createServerEntity({ identifier: 'a:e${i}', components: { lookedAt: { filters: { test: 'is_family', subject: '${subject}', value: 'x' } } } });`,
  )
  .join('\n')}
`),
    ).toEqual([]);
  });

  it('sugar of items and blocks', () => {
    expect(
      compile(`${header}
createItem({ identifier: 'a:i', components: { icon: 'key', displayName: 'Name', tags: ['a'] } });
createBlock({ identifier: 'a:b', components: { tags: ['a'], displayName: 'Name' } });
`),
    ).toEqual([]);
  });

  it('still rejects unknown components (the check is meaningful)', () => {
    expect(
      compile(`${header}
createItem({ identifier: 'a:i', components: { notAComponent: {} } });
`).length,
    ).toBeGreaterThan(0);
  });

  it('shows the removed minecraft:pushable component as deprecated', () => {
    const messages = suggestions(`${header}
import type { EntityComponents } from '@ferolyte/pack/content/server-entity/interfaces/entity-components';
declare const components: EntityComponents;
export const value = components.pushable;
`);

    expect(messages.some((m) => m.includes("'pushable' is deprecated"))).toBe(
      true,
    );
  });
});
