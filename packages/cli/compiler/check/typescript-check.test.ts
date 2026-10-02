import { describe, expect, it } from 'vitest';

import { parseTscOutput, runTypeCheck } from './typescript-check';

describe('parseTscOutput', () => {
  it('maps tsc errors to diagnostic records', () => {
    const records = parseTscOutput(
      [
        "src/a.ts(12,5): error TS2322: Type 'string' is not assignable to type 'number'.",
        "  The expected type comes from property 'x'.",
        "src/b.ts(1,1): warning TS6133: 'y' is declared but never used.",
        'Found 1 error.',
      ].join('\n'),
      '/project',
    );

    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({
      contentType: 'typescript',
      fieldPath: '12:5',
      severity: 'error',
      message:
        "TS2322: Type 'string' is not assignable to type 'number'. The expected type comes from property 'x'.",
    });
    expect(records[0].file.split('\\').join('/')).toMatch(/project\/src\/a\.ts$/);
    expect(records[1].severity).toBe('warning');
  });
});

describe('runTypeCheck', () => {
  it('reports one warning when typescript is not installed', async () => {
    const records = await runTypeCheck({ cwd: process.cwd(), tscPath: null });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      contentType: 'typescript',
      severity: 'warning',
    });
  });
});
