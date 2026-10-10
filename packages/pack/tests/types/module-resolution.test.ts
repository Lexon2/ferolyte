import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * Type-checks a consumer project per `moduleResolution` mode against the built packages
 * (`node_modules/@ferolyte/*` are the workspace links, so `package.json` `exports` / `typesVersions` and `dist`
 * are what a consumer gets from npm). Needs `dist` (`npm install` builds it).
 */
const here = path.dirname(fileURLToPath(import.meta.url));

const typeCheck = (fixture: string): string[] => {
  const configPath = path.join(here, 'fixtures', fixture, 'tsconfig.json');
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(configPath, ts.sys.readFile).config,
    ts.sys,
    path.dirname(configPath),
  );
  const program = ts.createProgram(parsed.fileNames, parsed.options);

  return ts
    .getPreEmitDiagnostics(program)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
};

describe('module resolution of the published packages', { timeout: 60_000 }, () => {
  it.each(['node', 'bundler', 'nodenext'])(
    'the @ferolyte/pack root and a subpath type-check under moduleResolution "%s"',
    (mode) => {
      expect(typeCheck(`resolution-${mode}`)).toEqual([]);
    },
  );
});
