import type { ContentDiagnosticRecord } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { formatDiagnosticLine } from './format-output';
import { logger } from './logger';

/**
 * Prints one line per diagnostic: errors always, warnings unless `--quiet`.
 * `--verbose` adds the remaining lines of multi-line messages.
 */
export const printDiagnostics = (
  records: readonly ContentDiagnosticRecord[],
  root: string = process.cwd(),
): void => {
  const color = logger.useColor;

  for (const record of records) {
    const line = formatDiagnosticLine(record, root, { color });
    if (record.severity === 'error') {
      logger.error(line);
    } else {
      logger.warn(line);
    }

    if (logger.isVerbose) {
      const rest = record.message.split(/\r?\n/).slice(1).filter(Boolean);
      rest.forEach((extra) => logger.verbose(`    ${extra}`));
    }
  }
};
