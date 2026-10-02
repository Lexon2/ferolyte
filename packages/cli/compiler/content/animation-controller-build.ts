import { registerContentJson } from '../registry/project-registry';
import { logger } from '../utils/logger';
import { AnimationControllerBuilder } from '@ferolyte/pack/content/animation-controller/animation-controller-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { ContentBuildOptions } from '../actions/options';
import { BUILD_CONTEXT } from '../build-context';
import { serializeJson } from './utils/serialize-json';
import { writeWithPlugins } from '../plugins/write-with-plugins';
import { createContentPath } from './utils/create-content-path';

/**
 * Builds `*.ac.bp.ts` / `*.ac.rp.ts`. A file exporting several controllers
 * produces one JSON with all of them.
 */
export const buildAnimationControllerJson = async (
  filePath: string,
  builders: AnimationControllerBuilder | AnimationControllerBuilder[],
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  const list = Array.isArray(builders) ? builders : [builders];

  const resolved = BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY.resolveContentFile(filePath);
  for (const builder of list) {
    const expected =
      resolved?.metadata === CONTENT_METADATA.ANIMATION_CONTROLLER_BP
        ? 'bp'
        : 'rp';
    if (builder.kind !== expected) {
      logger.error(
        `\n🛑 ${filePath}: ${builder.id} uses ${builder.kind.toUpperCase()} states, but the file suffix is for ${expected.toUpperCase()} controllers\n`,
      );

      return;
    }

    builder.withBuildContext({
      sourceFile: filePath,
      identifier: builder.id,
      diagnostics: options.diagnostics,
    });
  }

  const outFile = createContentPath(filePath);
  if (outFile === undefined) {
    logger.error(`Error creating content path for ${filePath}`);

    return;
  }

  const file = AnimationControllerBuilder.buildFile(list);
  registerContentJson(
    filePath,
    list[0].kind === 'bp' ? 'animation-controller-bp' : 'animation-controller-rp',
    file,
  );

  const result = await writeWithPlugins(
    filePath,
    outFile,
    serializeJson(file),
    'content',
    'utf-8',
  );

  return result.written ? result.destinationPath : undefined;
};
