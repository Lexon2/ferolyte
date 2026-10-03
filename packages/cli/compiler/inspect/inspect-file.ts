import { access } from 'fs/promises';
import { basename, resolve } from 'path';

import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { BUILD_CONTEXT } from '../build-context';
import { loadConfig } from '../config/load-config';
import { bundleEntries, evaluateBundle } from '../core/bundle';
import { extractContent } from '../content/content.factory';
import { initPlugins } from '../plugins/plugin-host';
import {
  beginSourceDocuments,
  commitSourceDocuments,
  DocumentKind,
  registerContentJson,
} from '../registry/project-registry';

/** Exit codes of `ferolyte inspect`. */
export const INSPECT_EXIT = {
  OK: 0,
  /** The file could not be compiled or does not export content. */
  BUILD_FAILED: 1,
  /** Bad arguments, missing file or missing config. */
  USAGE: 2,
} as const;

export type InspectResult =
  | { ok: true; json: unknown }
  | { ok: false; code: 1 | 2; message: string };

const FLOAT_PATTERN = /"\$ferolyte_float\[(-?\d+(?:\.\d+)?)\]"/g;

type InspectableBuilder = ContentBuilder & {
  build(): unknown;
  cloneConfig?(): { identifier?: string };
  withBuildContext?(ctx: Record<string, unknown>): unknown;
};

const CONTENT_TYPE_BY_METADATA: Record<string, string> = {
  [CONTENT_METADATA.ITEM]: 'item',
  [CONTENT_METADATA.BLOCK]: 'block',
  [CONTENT_METADATA.SERVER_ENTITY]: 'server-entity',
  [CONTENT_METADATA.CLIENT_ENTITY]: 'client-entity',
  [CONTENT_METADATA.ATTACHABLE]: 'attachable',
  [CONTENT_METADATA.RENDER_CONTROLLER]: 'render-controller',
  [CONTENT_METADATA.RECIPE]: 'recipe',
  [CONTENT_METADATA.SPAWN_RULE]: 'spawn-rule',
  [CONTENT_METADATA.ANIMATION_CONTROLLER_BP]: 'animation-controller-bp',
  [CONTENT_METADATA.ANIMATION_CONTROLLER_RP]: 'animation-controller-rp',
};

/**
 * Compiles a single content file in memory (no output is written, `@minecraft/*`
 * is stubbed) and returns the JSON the compiler would produce: an object for a
 * single builder, an array for multi-builder files.
 * Expects `BUILD_CONTEXT` to be loaded.
 */
export const inspectContentFile = async (
  filePath: string,
  options: { diagnostics?: boolean; placeholderIds?: boolean } = {},
): Promise<InspectResult> => {
  const entry = resolve(filePath);
  const name = basename(entry);

  try {
    await access(entry);
  } catch {
    return { ok: false, code: INSPECT_EXIT.USAGE, message: `File not found: ${entry}` };
  }

  const { bundled, failed } = await bundleEntries([entry], {
    stubMinecraft: true,
    placeholderIds: options.placeholderIds,
  });
  if (bundled.length === 0) {
    return {
      ok: false,
      code: INSPECT_EXIT.BUILD_FAILED,
      message: `Failed to bundle ${name}: ${failed[0] ? String(failed[0].error) : 'unknown error'}`,
    };
  }

  let content: ContentBuilder | ContentBuilder[] | undefined;
  try {
    content = extractContent(evaluateBundle(bundled[0].code, entry));
  } catch (error) {
    return {
      ok: false,
      code: INSPECT_EXIT.BUILD_FAILED,
      message: `Failed to evaluate ${name}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  if (content === undefined) {
    return {
      ok: false,
      code: INSPECT_EXIT.BUILD_FAILED,
      message: `${name} has no default export with content`,
    };
  }

  try {
    const builders = Array.isArray(content) ? content : [content];
    beginSourceDocuments(entry);
    const results = builders.map((builder) => {
      const inspectable = builder as InspectableBuilder;
      const contentType = CONTENT_TYPE_BY_METADATA[inspectable.metadata ?? ''];
      if (contentType === undefined || typeof inspectable.build !== 'function') {
        throw new Error(`Unknown content type in ${name}`);
      }

      inspectable.withBuildContext?.({
        sourceFile: entry,
        identifier: (inspectable.cloneConfig?.() as { identifier?: string } | undefined)?.identifier,
        diagnostics: options.diagnostics ?? false,
        contentType,
        minGameVersion: BUILD_CONTEXT.PACKS.MIN_GAME_VERSION,
      });

      // Same float handling as the real build, then back to plain JSON.
      const json = JSON.parse(
        JSON.stringify(inspectable.build()).replace(FLOAT_PATTERN, '$1'),
      );
      registerContentJson(entry, contentType as DocumentKind, json);

      return json;
    });
    commitSourceDocuments(entry);

    return { ok: true, json: Array.isArray(content) ? results : results[0] };
  } catch (error) {
    return {
      ok: false,
      code: INSPECT_EXIT.BUILD_FAILED,
      message: `Failed to build ${name}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Loads the profile (plugins disabled) and inspects the file.
 */
export const inspectWithProfile = async (
  filePath: string,
  profile: string,
  options: { diagnostics?: boolean } = {},
): Promise<InspectResult> => {
  try {
    await loadConfig(profile);
  } catch (error) {
    return {
      ok: false,
      code: INSPECT_EXIT.USAGE,
      message: error instanceof Error ? error.message : String(error),
    };
  }
  initPlugins([], profile);

  return inspectContentFile(filePath, options);
};
