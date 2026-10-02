import { BUILD_CONTEXT } from '../../build-context';
import { registerContentJson } from '../../registry/project-registry';
import { logger } from '../../utils/logger';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';
import { registerItemLang } from '../../lang/register-content-lang';
import { ContentBuildOptions } from '../../actions/options';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';

export const buildItemJson = async (
  filePath: string,
  builder: ItemBuilder,
  options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  builder.withBuildContext({
    sourceFile: filePath,
    identifier: builder.cloneConfig().identifier,
    diagnostics: options.diagnostics,
    contentType: 'item',
    minGameVersion: BUILD_CONTEXT.PACKS.MIN_GAME_VERSION,
  });

  const json = builder.build();
  registerContentJson(filePath, 'item', json);
  const itemConfig = builder.cloneConfig();
  registerItemLang(filePath, itemConfig.identifier, itemConfig.components?.displayName);
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
