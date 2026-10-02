import type { DocumentBuilder } from '@ferolyte/pack/content/documents/document-builder';
import { RenderControllerBuilder } from '@ferolyte/pack/content/render-controller/render-controller-builder';
import { ContentBuildOptions } from '../../actions/options';
import { BUILD_CONTEXT } from '../../build-context';
import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { buildDocumentJson } from '../document/build';
import { createContentPath } from '../utils/create-content-path';
import { serializeJson } from '../utils/serialize-json';

/**
 * Builds `*.rc.ts`: every `createRenderController` builder of the file goes into one JSON
 * (or the document escape hatch `createRenderControllerDocument`).
 */
export const buildRenderControllerJson = async (
  filePath: string,
  builders:
    | RenderControllerBuilder
    | RenderControllerBuilder[]
    | DocumentBuilder<'renderController'>,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  const list = Array.isArray(builders) ? builders : [builders];
  if (!(list[0] instanceof RenderControllerBuilder)) {
    return buildDocumentJson(
      filePath,
      list[0] as DocumentBuilder<'renderController'>,
      options,
    );
  }

  const sugar = list as RenderControllerBuilder[];
  for (const builder of sugar) {
    builder.withBuildContext({
      sourceFile: filePath,
      identifier: builder.id,
      diagnostics: options.diagnostics,
      contentType: 'render-controller',
      minGameVersion: BUILD_CONTEXT.PACKS.MIN_GAME_VERSION,
    });
  }

  const json = RenderControllerBuilder.buildFile(sugar);
  registerContentJson(filePath, 'render-controller', json);

  const outFile = createContentPath(filePath);
  if (outFile === undefined) {
    logger.error(`Error creating content path for ${filePath}`);

    return;
  }

  const result = await writeWithPlugins(
    filePath,
    outFile,
    serializeJson(json),
    'content',
    'utf-8',
  );

  return result.written ? result.destinationPath : undefined;
};
