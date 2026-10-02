import { reportDiagnosticRecord } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { writeIdsFile } from './ids-generator';
import { buildIndex, scanResources } from './project-registry';
import { runReferenceChecks } from './reference-checks';

export interface RefreshOptions {
  /**
   * Content sources rebuilt in this batch. They are always checked; when a pack
   * file (geometry, animation, texture list...) changed, every document is.
   */
  only?: ReadonlySet<string>;
  /** Run the reference checks. @default true */
  checks?: boolean;
  /** Write `.ferolyte/types/ids.ts`. @default true */
  ids?: boolean;
}

/**
 * Incremental registry update after a build or a watch batch: re-reads changed
 * pack files, checks references and refreshes the generated ids file.
 */
export const refreshRegistry = async (
  options: RefreshOptions = {},
): Promise<{ idsWritten: boolean }> => {
  const resourcesChanged = await scanResources();
  const index = buildIndex();

  if (options.checks !== false) {
    runReferenceChecks(index, resourcesChanged ? undefined : options.only);
  }

  if (options.ids === false) {
    return { idsWritten: false };
  }

  const { written, warnings } = await writeIdsFile(index);
  for (const warning of warnings) {
    reportDiagnosticRecord({
      file: '',
      contentType: 'ids',
      component: '',
      fieldPath: '',
      message: warning.message,
      severity: 'warning',
    });
  }

  return { idsWritten: written };
};
