import { BUILD_CONTEXT } from '../../build-context';
import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';
import type { DocumentBuilder } from '@ferolyte/pack/content/documents/document-builder';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';

const DOCUMENT_KIND = {
  attachable: 'attachable',
  renderController: 'render-controller',
  recipe: 'recipe',
  spawnRule: 'spawn-rule',
} as const;

/** Builds one generated document (attachable, render controller, recipe, spawn rule) and writes it. */
export const buildDocumentJson = async (
  filePath: string,
  builder: DocumentBuilder,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  const identifier = builder.identifier();
  builder.withBuildContext({
    sourceFile: filePath,
    identifier,
    diagnostics: options.diagnostics,
    contentType: DOCUMENT_KIND[builder.kind],
    minGameVersion: BUILD_CONTEXT.PACKS.MIN_GAME_VERSION,
  });

  const json = builder.build();
  registerContentJson(filePath, DOCUMENT_KIND[builder.kind], json);

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

  return writeResult.written ? writeResult.destinationPath : undefined;
};
