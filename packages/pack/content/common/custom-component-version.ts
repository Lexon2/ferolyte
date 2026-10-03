import {
  ContentDiagnosticContext,
  logContentWarning,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';

/** Namespaced custom components written as component keys need this format version (older ones used `minecraft:custom_components`). */
export const CUSTOM_COMPONENT_MIN_VERSION = '1.21.90';

/**
 * Warns about namespaced custom component keys (`ns:name`) in a file whose `format_version` is older than
 * 1.21.90. `version` is the version that is written to the file, not the profile `minGameVersion`.
 */
export const checkCustomComponentVersion = (
  keys: Iterable<string>,
  version: string,
  ctx: ContentDiagnosticContext | undefined,
): void => {
  if (isVersionAtLeast(version, CUSTOM_COMPONENT_MIN_VERSION)) {
    return;
  }
  for (const key of keys) {
    if (key.includes(':') && !key.startsWith('minecraft:')) {
      logContentWarning(
        ctx === undefined ? undefined : { ...ctx, component: key, fieldPath: undefined },
        `Custom component "${key}" needs format_version ${CUSTOM_COMPONENT_MIN_VERSION} or higher, but this file is written as ${version}; set \`version: '${CUSTOM_COMPONENT_MIN_VERSION}'\` (or higher)`,
      );
    }
  }
};
