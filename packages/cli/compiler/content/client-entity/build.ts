import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';

import { ClientEntityBuilder } from '@ferolyte/pack/content/client-entity/client-entity-builder';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';
import {
  prepareAnimationOptions,
  writeAnimationClones,
} from '../utils/animation-clones';

export const buildClientEntityJson = async (
  filePath: string,
  builder: ClientEntityBuilder,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string[] | undefined> => {
  const config = builder.cloneConfig();
  const identifier = config.identifier ?? '';

  const animations = await prepareAnimationOptions(
    filePath,
    config.animations,
    identifier,
    'client-entity',
    options.diagnostics,
  );
  if (animations) {
    builder.withAnimationResolver(animations.resolve);
  }

  const json = builder.build();
  registerContentJson(filePath, 'client-entity', json, {
    animations: animations ? [...animations.resolution.clones.keys()] : [],
  });

  const outFile = createContentPath(filePath, undefined, { identifier });
  if (identifier === undefined || outFile === undefined) {
    logger.error(`Error creating content path for ${filePath}`);

    return;
  }

  const writeResult = await writeWithPlugins(
    filePath,
    outFile,
    serializeJson(json),
    'content',
    'utf-8',
  );

  if (!writeResult.written) {
    return;
  }

  const outputs = [writeResult.destinationPath];
  if (animations) {
    const clones = await writeAnimationClones(
      filePath,
      animations,
      identifier.split(':').pop() as string,
    );
    if (clones) {
      outputs.push(clones);
    }
  }

  return outputs;
};
