import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { registerBlockLang } from '../../lang/register-content-lang';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { BUILD_CONTEXT } from '../../build-context';
import { createContentPath } from '../utils/create-content-path';

export const buildBlockJson = async (
  filePath: string,
  builder: BlockBuilder,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  builder.withBuildContext({
    sourceFile: filePath,
    identifier: builder.cloneConfig().identifier,
    diagnostics: options.diagnostics,
    contentType: 'block',
    minGameVersion: BUILD_CONTEXT.PACKS.MIN_GAME_VERSION,
  });

  const json = builder.build();
  registerContentJson(filePath, 'block', json);
  const blockConfig = builder.cloneConfig();
  registerBlockLang(filePath, blockConfig.identifier, blockConfig.components?.displayName);
  const jsonString = serializeJson(json);

  const identifier = builder.cloneConfig().identifier ?? '';
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

  return writeResult.destinationPath;
};
