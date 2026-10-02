import { join } from 'path';

import type { ClientEntityAnimationResolver } from '@ferolyte/pack/content/client-entity/interfaces/animations-collection';
import { getAnimationIndex } from '../../animation/animation-index';
import {
  AnimationResolution,
  createAnimationResolver,
  hasAnimationOptions,
} from '../../animation/animation-resolver';
import { BUILD_CONTEXT } from '../../build-context';
import { addEntryInputs } from '../../core/graph';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { serializeJson } from './serialize-json';

const DEFAULT_ANIMATION_FORMAT_VERSION = '1.8.0';

export interface PreparedAnimations {
  resolve: ClientEntityAnimationResolver;
  resolution: AnimationResolution;
}

/**
 * Animations with options (F3) of a client entity / attachable: resolves them against the animation index
 * and returns the resolver to install on the builder (`undefined` when no animation has options).
 */
export const prepareAnimationOptions = async (
  filePath: string,
  animations: Record<string, unknown> | undefined,
  identifier: string,
  contentType: 'client-entity' | 'attachable',
  diagnostics: boolean,
): Promise<PreparedAnimations | undefined> =>
  hasAnimationOptions(animations)
    ? createAnimationResolver(
        await getAnimationIndex(),
        diagnostics
          ? { sourceFile: filePath, identifier, diagnostics: true, contentType }
          : undefined,
      )
    : undefined;

/**
 * Adds the source animation files to the graph (editing them rebuilds the file) and writes the patched
 * clones to `animations/ferolyte/<name>.animation.json`.
 * @returns The written clone file, if any.
 */
export const writeAnimationClones = async (
  filePath: string,
  prepared: PreparedAnimations,
  name: string,
): Promise<string | undefined> => {
  addEntryInputs(filePath, prepared.resolution.sources);

  const { clones } = prepared.resolution;
  if (clones.size === 0) {
    return undefined;
  }

  const versions = [...clones.values()]
    .map((clone) => clone.formatVersion)
    .filter((version): version is string => version !== undefined)
    .sort();
  const result = await writeWithPlugins(
    filePath,
    join(
      BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH,
      'animations',
      'ferolyte',
      `${name}.animation.json`,
    ),
    serializeJson({
      format_version:
        versions[versions.length - 1] ?? DEFAULT_ANIMATION_FORMAT_VERSION,
      animations: Object.fromEntries(
        [...clones].map(([id, clone]) => [id, clone.definition]),
      ),
    }),
    'content',
    'utf-8',
  );

  return result.written ? result.destinationPath : undefined;
};
