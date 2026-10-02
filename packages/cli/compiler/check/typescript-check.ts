import { spawn } from 'child_process';
import { createRequire } from 'module';
import { join, resolve } from 'path';

import type { ContentDiagnosticRecord } from '@ferolyte/common/content/diagnostics/content-diagnostic';

const DIAGNOSTIC_LINE = /^(.+?)\((\d+),(\d+)\): (error|warning) (TS\d+): (.*)$/;

/**
 * Parses `tsc --pretty false` output. Continuation lines (indented) belong to
 * the previous diagnostic.
 */
export const parseTscOutput = (
  output: string,
  cwd: string,
): ContentDiagnosticRecord[] => {
  const records: ContentDiagnosticRecord[] = [];

  for (const line of output.split(/\r?\n/)) {
    const match = DIAGNOSTIC_LINE.exec(line);
    if (match) {
      const [, file, row, column, severity, code, message] = match;
      records.push({
        file: resolve(cwd, file),
        contentType: 'typescript',
        component: '',
        fieldPath: `${row}:${column}`,
        message: `${code}: ${message}`,
        severity: severity === 'warning' ? 'warning' : 'error',
      });
    } else if (/^\s+\S/.test(line) && records.length > 0) {
      records[records.length - 1].message += ` ${line.trim()}`;
    }
  }

  return records;
};

const missingTypescript = (message: string): ContentDiagnosticRecord => ({
  file: '',
  contentType: 'typescript',
  component: '',
  fieldPath: '',
  message,
  severity: 'warning',
});

const resolveTsc = (cwd: string): string | undefined => {
  try {
    return createRequire(join(cwd, 'package.json')).resolve(
      'typescript/lib/tsc.js',
    );
  } catch {
    return undefined;
  }
};

export interface TypeCheckOptions {
  cwd: string;
  tsconfig?: string;
  /** Override for tests. */
  tscPath?: string | null;
}

/**
 * Runs the project's own `typescript` (`tsc --noEmit -p <tsconfig>`): esbuild does
 * not type-check, so this finds the errors an editor would show.
 */
export const runTypeCheck = async ({
  cwd,
  tsconfig,
  tscPath,
}: TypeCheckOptions): Promise<ContentDiagnosticRecord[]> => {
  const tsc = tscPath === undefined ? resolveTsc(cwd) : (tscPath ?? undefined);
  if (!tsc) {
    return [
      missingTypescript(
        'typescript is not installed in the project: type check skipped (npm i -D typescript)',
      ),
    ];
  }

  const args = [tsc, '--noEmit', '--pretty', 'false'];
  if (tsconfig) {
    args.push('-p', tsconfig);
  }

  const output = await new Promise<string>((done, fail) => {
    const child = spawn(process.execPath, args, { cwd });
    let text = '';
    child.stdout.on('data', (chunk) => (text += chunk));
    child.stderr.on('data', (chunk) => (text += chunk));
    child.on('error', fail);
    child.on('close', () => done(text));
  });

  return parseTscOutput(output, cwd);
};
