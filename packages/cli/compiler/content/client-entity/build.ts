import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';
import { join } from 'path';

import { ClientEntityBuilder } from '@ferolyte/pack/content/client-entity/client-entity-builder';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';
import { BUILD_CONTEXT } from '../../build-context';
import { getAnimationIndex } from '../../animation/animation-index';
import {
  createAnimationResolver,
  hasAnimationOptions,
} from '../../animation/animation-resolver';
import { addEntryInputs } from '../../core/graph';

const DEFAULT_ANIMATION_FORMAT_VERSION = '1.8.0';

export const buildClientEntityJson = async (
  filePath: string,
  builder: ClientEntityBuilder,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string[] | undefined> => {
  const config = builder.cloneConfig();
  const identifier = config.identifier ?? '';

  const animations = hasAnimationOptions(config.animations)
    ? createAnimationResolver(
        await getAnimationIndex(),
        options.diagnostics
          ? {
              sourceFile: filePath,
              identifier,
              diagnostics: true,
              contentType: 'client-entity',
            }
          : undefined,
      )
    : undefined;
  if (animations) {
    builder.withAnimationResolver(animations.resolve);
  }

  const json = builder.build();
  registerContentJson(filePath, 'client-entity', json, {
    animations: animations ? [...animations.resolution.clones.keys()] : [],
  });
  const jsonString = serializeJson(json);

  const outFile = createContentPath(filePath, undefined, { identifier });
  if (identifier === undefined || outFile === undefined) {
    logger.error(`Error creating content path for ${filePath}`);

    return;
  }

  const writeResult = await writeWithPlugins(
    filePath,
    outFile,
    jsonString,
    'content',
    'utf-8',
  );

  if (!writeResult.written) {
    return;
  }

  const outputs = [writeResult.destinationPath];

  if (animations) {
    // Editing a source animation rebuilds the entity (and its clones).
    addEntryInputs(filePath, animations.resolution.sources);

    const { clones } = animations.resolution;
    if (clones.size > 0) {
      const versions = [...clones.values()]
        .map((clone) => clone.formatVersion)
        .filter((version): version is string => version !== undefined)
        .sort();
      const cloneFile = join(
        BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH,
        'animations',
        'ferolyte',
        `${identifier.split(':').pop()}.animation.json`,
      );
      const cloneResult = await writeWithPlugins(
        filePath,
        cloneFile,
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
      if (cloneResult.written) {
        outputs.push(cloneResult.destinationPath);
      }
    }
  }

  return outputs;
};
