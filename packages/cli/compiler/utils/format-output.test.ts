import { join, sep } from 'path';

import { describe, expect, it } from 'vitest';

import {
  BuildStats,
  formatBuildSummary,
  formatClock,
  formatDiagnosticLine,
  formatDuration,
  formatWatchLine,
} from './format-output';
import { logger, resolveLogLevel } from './logger';

const stats: BuildStats = {
  profile: 'dev',
  totalMs: 1240,
  content: {
    files: 42,
    json: 47,
    byType: {
      'server-entity': 19,
      item: 12,
      block: 6,
      'animation-controller-bp': 1,
      'animation-controller-rp': 3,
      'client-entity': 6,
    },
    bundleMs: 310,
    evalMs: 95,
    writeMs: 60,
  },
  copy: { files: 1932, ms: 480 },
  lang: { locales: 2, keys: 58, ms: 12 },
};

describe('formatDuration', () => {
  it('uses ms below a second and seconds above', () => {
    expect(formatDuration(64.4)).toBe('64 ms');
    expect(formatDuration(1240)).toBe('1.24 s');
  });
});

describe('formatBuildSummary', () => {
  it('prints the summary block without colors', () => {
    expect(formatBuildSummary(stats, { warnings: 3, errors: 0 })).toBe(
      [
        '✓ build dev · 1.24 s',
        '  content 42 files → 47 json   (entities 19, items 12, blocks 6, ac 4, ce 6)   bundle 310 ms · eval 95 ms · write 60 ms',
        '  copy    1 932 files                                                          480 ms',
        '  lang    2 locales, 58 keys                                                   12 ms',
        '  ⚠ 3 warnings  ✖ 0 errors      (ferolyte check --json for details)',
      ].join('\n'),
    );
  });

  it('marks a failed build and hides lang without keys', () => {
    const text = formatBuildSummary(
      { ...stats, lang: { locales: 0, keys: 0, ms: 0 } },
      { warnings: 0, errors: 1 },
    );

    expect(text.startsWith('✖ build dev')).toBe(true);
    expect(text).not.toContain('lang');
    expect(text).toContain('⚠ 0 warnings  ✖ 1 error');
  });
});

describe('formatDiagnosticLine', () => {
  it('formats one line with a project-relative path', () => {
    const root = join(sep, 'proj');
    const file = join(root, 'BP', 'entities', 'zombie.se.ts');

    expect(
      formatDiagnosticLine(
        {
          file,
          contentType: 'server-entity',
          component: 'lookAtPlayer',
          fieldPath: 'components.lookAtPlayer.look_distance',
          message: '"look_distance" → "lookDistance"\nmore',
          severity: 'warning',
        },
        root,
      ),
    ).toBe(
      '⚠ BP/entities/zombie.se.ts  components.lookAtPlayer.look_distance  "look_distance" → "lookDistance"',
    );
  });
});

describe('formatWatchLine', () => {
  const time = '21:04:13';

  it('entry with dependents', () => {
    expect(
      formatWatchLine({
        time,
        content: { label: 'zombie.se.ts', isEntry: true, dependents: 2, json: 3, ms: 64, warnings: 0 },
      }),
    ).toBe('21:04:13 ✓ zombie.se.ts (+2 dependents) · 3 json · 64 ms');
  });

  it('shared file with warnings', () => {
    expect(
      formatWatchLine({
        time,
        content: { label: 'shared/constants.ts', isEntry: false, dependents: 19, json: 19, ms: 162, warnings: 1 },
      }),
    ).toBe('21:04:13 ✓ shared/constants.ts → 19 dependents · 162 ms · ⚠ 1');
  });

  it('failure, copy + lang + extra segments', () => {
    expect(
      formatWatchLine({
        time,
        content: { label: 'husk.se.ts', isEntry: true, dependents: 0, json: 0, ms: 10, warnings: 0, error: 'Unexpected "}" (12:4)' },
      }),
    ).toBe('21:04:13 ✖ husk.se.ts  Unexpected "}" (12:4)');
    expect(
      formatWatchLine({
        time,
        copied: { count: 4, hint: 'textures/…' },
        lang: true,
        extra: ['↻ reload sent (2 clients)'],
      }),
    ).toBe('21:04:13 ⧉ 4 copied (textures/…) · 🌐 lang · ↻ reload sent (2 clients)');
  });

  it('formats the clock with two digits', () => {
    expect(formatClock(new Date(2026, 0, 1, 3, 4, 5))).toBe('03:04:05');
  });
});

describe('logger', () => {
  it('resolves levels from flags', () => {
    expect(resolveLogLevel({ quiet: true })).toBe('quiet');
    expect(resolveLogLevel({ debug: false })).toBe('quiet');
    expect(resolveLogLevel({ verbose: true })).toBe('verbose');
    expect(resolveLogLevel({})).toBe('normal');
  });

  it('suppresses info in quiet mode but keeps errors', () => {
    const lines: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    console.log = (message: string) => lines.push(`log:${message}`);
    console.error = (message: string) => lines.push(`err:${message}`);
    try {
      logger.setLevel('quiet');
      logger.info('a');
      logger.verbose('b');
      logger.error('c');
      logger.setLevel('verbose');
      logger.verbose('d');
    } finally {
      console.log = originalLog;
      console.error = originalError;
      logger.setLevel('normal');
    }

    expect(lines).toEqual(['err:c', 'log:d']);
  });
});
