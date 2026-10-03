import {
  ContentDiagnosticRecord,
  getContentDiagnosticSink,
  setContentDiagnosticSink,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';

export interface DiagnosticsCollector {
  readonly records: ContentDiagnosticRecord[];
  /** Number of records with `error` severity. */
  errorCount(): number;
  /** Number of records with `warning` severity. */
  warningCount(): number;
  /** Forgets the records of a file (it is about to be evaluated again), so its new diagnostics are not taken for duplicates. */
  discardFile(file: string): void;
  /** Detaches from the diagnostic sink (the previous sink is restored). */
  stop(): void;
}

/**
 * Collects structured content diagnostics (deduplicated) until `stop()`.
 * With `silent` the human-readable console output of the diagnostics is suppressed.
 * Collectors nest: records are forwarded to the sink that was attached before,
 * which is restored on `stop()`.
 */
export const collectDiagnostics = (
  options: { silent?: boolean } = {},
): DiagnosticsCollector => {
  const records: ContentDiagnosticRecord[] = [];
  const seen = new Map<string, ContentDiagnosticRecord>();
  const previous = getContentDiagnosticSink();

  setContentDiagnosticSink(
    (record) => {
      previous.sink?.(record);

      const key = JSON.stringify(record);
      if (seen.has(key)) {
        return;
      }

      seen.set(key, record);
      records.push(record);
    },
    { silent: options.silent === true || previous.silent },
  );

  return {
    records,
    errorCount: () => records.filter((r) => r.severity === 'error').length,
    warningCount: () => records.filter((r) => r.severity === 'warning').length,
    discardFile: (file) => {
      for (let index = records.length - 1; index >= 0; index--) {
        if (records[index].file === file) {
          records.splice(index, 1);
        }
      }
      for (const [key, record] of seen) {
        if (record.file === file) {
          seen.delete(key);
        }
      }
    },
    stop: () =>
      setContentDiagnosticSink(previous.sink, { silent: previous.silent }),
  };
};

export const formatDiagnostic = (record: ContentDiagnosticRecord): string => {
  const place = [record.contentType, record.fieldPath]
    .filter((part) => part.length > 0)
    .join(' ');

  return `${record.severity} ${record.file}${place ? ` [${place}]` : ''}: ${record.message}`;
};
