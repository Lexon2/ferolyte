import { relative } from 'path';

import type { ContentDiagnosticRecord } from '@ferolyte/common/content/diagnostics/content-diagnostic';

export interface BuildStats {
  profile: string;
  totalMs: number;
  content: {
    files: number;
    json: number;
    /** Entries per content type key (`server-entity`, `item`, ...). */
    byType: Record<string, number>;
    bundleMs: number;
    evalMs: number;
    writeMs: number;
  };
  copy: { files: number; ms: number };
  lang: { locales: number; keys: number; ms: number };
}

export interface FormatOptions {
  color?: boolean;
}

const paint = (code: string, text: string, color?: boolean) =>
  color ? `\u001b[${code}m${text}\u001b[0m` : text;

export const green = (text: string, color?: boolean) => paint('32', text, color);
export const yellow = (text: string, color?: boolean) => paint('33', text, color);
export const red = (text: string, color?: boolean) => paint('31', text, color);
export const dim = (text: string, color?: boolean) => paint('2', text, color);

/** `1932` -> `1 932`. */
export const formatCount = (value: number): string =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** `64 ms`, `1.24 s`. */
export const formatDuration = (ms: number): string =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;

const plural = (count: number, one: string, many = `${one}s`) =>
  `${formatCount(count)} ${count === 1 ? one : many}`;

const TYPE_GROUPS: Array<[label: string, keys: string[]]> = [
  ['entities', ['server-entity']],
  ['items', ['item']],
  ['blocks', ['block']],
  ['ac', ['animation-controller-bp', 'animation-controller-rp']],
  ['ce', ['client-entity']],
  ['attachables', ['attachable']],
  ['render controllers', ['render-controller']],
  ['recipes', ['recipe']],
  ['spawn rules', ['spawn-rule']],
];

const formatTypes = (byType: Record<string, number>): string => {
  const parts = TYPE_GROUPS.map(
    ([label, keys]) =>
      [label, keys.reduce((sum, key) => sum + (byType[key] ?? 0), 0)] as const,
  )
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${label} ${count}`);

  return parts.length > 0 ? `(${parts.join(', ')})` : '';
};

/**
 * Multi-line summary of a full build (`run`, initial `watch` build).
 */
export const formatBuildSummary = (
  stats: BuildStats,
  counts: { warnings: number; errors: number },
  options: FormatOptions = {},
): string => {
  const { color } = options;
  const failed = counts.errors > 0;
  const head = `${failed ? red('✖', color) : green('✓', color)} build ${stats.profile} · ${formatDuration(stats.totalMs)}`;

  const rows: Array<[label: string, main: string, timing: string]> = [
    [
      'content',
      `${plural(stats.content.files, 'file')} → ${formatCount(stats.content.json)} json   ${formatTypes(stats.content.byType)}`.trimEnd(),
      `bundle ${formatDuration(stats.content.bundleMs)} · eval ${formatDuration(stats.content.evalMs)} · write ${formatDuration(stats.content.writeMs)}`,
    ],
    ['copy', plural(stats.copy.files, 'file'), formatDuration(stats.copy.ms)],
  ];
  if (stats.lang.keys > 0) {
    rows.push([
      'lang',
      `${plural(stats.lang.locales, 'locale')}, ${plural(stats.lang.keys, 'key')}`,
      formatDuration(stats.lang.ms),
    ]);
  }

  const width = Math.max(...rows.map(([, main]) => main.length));
  const lines = [head];
  for (const [label, main, timing] of rows) {
    lines.push(`  ${label.padEnd(8)}${main.padEnd(width)}   ${dim(timing, color)}`);
  }

  const warnings = `⚠ ${plural(counts.warnings, 'warning')}`;
  const errors = `✖ ${plural(counts.errors, 'error')}`;
  lines.push(
    `  ${counts.warnings > 0 ? yellow(warnings, color) : warnings}  ${failed ? red(errors, color) : errors}` +
      (counts.warnings + counts.errors > 0
        ? `      ${dim('(ferolyte check --json for details)', color)}`
        : ''),
  );

  return lines.join('\n');
};

/** Path relative to `root` when inside it. */
export const shortPath = (file: string, root: string): string => {
  if (file.length === 0) {
    return '';
  }
  const rel = relative(root, file);

  return rel.startsWith('..') || rel === '' ? file : rel.split('\\').join('/');
};

/**
 * One line per diagnostic: `⚠ BP/entities/zombie.se.ts  components.x  message`.
 * Only the first line of a multi-line message is used.
 */
export const formatDiagnosticLine = (
  record: ContentDiagnosticRecord,
  root: string,
  options: FormatOptions = {},
): string => {
  const { color } = options;
  const icon =
    record.severity === 'error' ? red('✖', color) : yellow('⚠', color);
  const [message] = record.message.split(/\r?\n/);
  const parts = [shortPath(record.file, root), record.fieldPath, message].filter(
    (part) => part.length > 0,
  );

  return `${icon} ${parts.join('  ')}`;
};

export interface WatchBatchInfo {
  /** `HH:MM:SS`. */
  time: string;
  content?: {
    /** File name, or `3 files`. */
    label: string;
    /** The changed file is itself a content entry. */
    isEntry: boolean;
    dependents: number;
    json: number;
    ms: number;
    warnings: number;
    /** First error message; the batch is then reported as failed. */
    error?: string;
  };
  copied?: { count: number; hint?: string };
  removed?: { count: number; label?: string };
  lang?: boolean;
  extra?: string[];
}

/**
 * One line per watch batch, e.g.
 * `21:04:13 ✓ zombie.se.ts (+2 dependents) · 3 json · 64 ms`.
 */
export const formatWatchLine = (
  batch: WatchBatchInfo,
  options: FormatOptions = {},
): string => {
  const { color } = options;
  const parts: string[] = [];
  const { content } = batch;

  if (content) {
    const dependents = plural(content.dependents, 'dependent');
    if (content.error !== undefined) {
      parts.push(`${red('✖', color)} ${content.label}  ${content.error}`);
    } else {
      let text = `${green('✓', color)} ${content.label}`;
      if (content.isEntry && content.dependents > 0) {
        text += ` (+${dependents})`;
      } else if (!content.isEntry) {
        text += ` → ${dependents}`;
      }
      if (content.isEntry) {
        text += ` · ${formatCount(content.json)} json`;
      }
      text += ` · ${formatDuration(content.ms)}`;
      if (content.warnings > 0) {
        text += ` · ${yellow(`⚠ ${content.warnings}`, color)}`;
      }
      parts.push(text);
    }
  }
  if (batch.copied) {
    parts.push(
      `⧉ ${formatCount(batch.copied.count)} copied${batch.copied.hint ? ` (${batch.copied.hint})` : ''}`,
    );
  }
  if (batch.removed) {
    parts.push(
      `🗑 ${batch.removed.label ?? plural(batch.removed.count, 'file')} removed`,
    );
  }
  if (batch.lang) {
    parts.push('🌐 lang');
  }
  parts.push(...(batch.extra ?? []));

  return `${dim(batch.time, color)} ${parts.join(' · ')}`;
};

export const formatClock = (date: Date = new Date()): string =>
  [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
