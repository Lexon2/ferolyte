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
  const seen = new Set<string>();
  const previous = getContentDiagnosticSink();

  setContentDiagnosticSink(
    (record) => {
      previous.sink?.(record);

      const key = JSON.stringify(record);
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      records.push(record);
    },
    { silent: options.silent === true || previous.silent },
  );

  return {
    records,
    errorCount: () => records.filter((r) => r.severity === 'error').length,
    warningCount: () => records.filter((r) => r.severity === 'warning').length,
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
