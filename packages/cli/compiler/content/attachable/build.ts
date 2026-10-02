import { AttachableBuilder } from '@ferolyte/pack/content/attachable/attachable-builder';
import type { DocumentBuilder } from '@ferolyte/pack/content/documents/document-builder';
import { ContentBuildOptions } from '../../actions/options';
import { BUILD_CONTEXT } from '../../build-context';
import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { buildDocumentJson } from '../document/build';
import {
  prepareAnimationOptions,
  writeAnimationClones,
} from '../utils/animation-clones';
import { createContentPath } from '../utils/create-content-path';
import { serializeJson } from '../utils/serialize-json';

/**
 * Builds `*.att.ts`: the flat `createAttachable` form (with animation options and clones)
 * or the document escape hatch `createAttachableDocument`.
 */
export const buildAttachableJson = async (
  filePath: string,
  builder: AttachableBuilder | DocumentBuilder<'attachable'>,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string[] | string | undefined> => {
  if (!(builder instanceof AttachableBuilder)) {
    return buildDocumentJson(filePath, builder, options);
  }

  const identifier = builder.identifier();
  const animations = await prepareAnimationOptions(
    filePath,
    builder.cloneConfig().animations,
    identifier,
    'attachable',
    options.diagnostics,
  );
  if (animations) {
    builder.withAnimationResolver(animations.resolve);
  }

  builder.withBuildContext({
    sourceFile: filePath,
    identifier,
    diagnostics: options.diagnostics,
    contentType: 'attachable',
    minGameVersion: BUILD_CONTEXT.PACKS.MIN_GAME_VERSION,
  });
  const json = builder.build();
  registerContentJson(filePath, 'attachable', json, {
    animations: animations ? [...animations.resolution.clones.keys()] : [],
  });

  const outFile = createContentPath(filePath, undefined, { identifier });
  if (outFile === undefined) {
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
      `${identifier.split(':').pop()}.att`,
    );
    if (clones) {
      outputs.push(clones);
    }
  }

  return outputs;
};
