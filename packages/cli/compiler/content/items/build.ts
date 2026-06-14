import { ItemBuilder } from '@artifex/pack/content/item/item-builder';
import { ContentBuildOptions } from '../../actions/options';
import { BUILD_CONTEXT } from '../../build-context';
import { serializeJson } from '../utils/serialize-json';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { createContentPath } from '../utils/create-content-path';
import { setSourceItemTextures } from './item-texture-atlas';

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
  });
  builder.withPackConfig({ namespace: BUILD_CONTEXT.PACKS.NAMESPACE });

  const json = builder.build();
  const jsonString = serializeJson(json);

  const identifier = builder.cloneConfig().identifier ?? '';
  const outFile = createContentPath(filePath, undefined, { identifier });
  if (identifier === undefined || outFile === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  setSourceItemTextures(filePath, builder.getItemTextureEntries());

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
