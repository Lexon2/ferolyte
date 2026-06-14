import { join } from 'path';

import { ItemBuilder } from '@artifex/pack/content/item/item-builder';
import { BUILD_CONTEXT } from '../../build-context';
import { formatFileName } from '../utils/format-file-name';
import { writeWithPlugins } from '../../plugins/write-with-plugins';
import { ContentBuildOptions } from '../../actions/options';

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

  const json = builder.build();
  const jsonString = JSON.stringify(json, null, 2);

  const identifier = builder.cloneConfig().identifier ?? '';
  const fileName = formatFileName(identifier.split(':')[1], '.item.json');
  if (identifier === undefined || fileName === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH } =
    BUILD_CONTEXT.PACKS;
  const outFile = join(
    OUTPUT_BEHAVIOR_PACK_PATH,
    'items',
    OUTPUT_NAMESPACE_PATH,
    fileName,
  );
  if (outFile === undefined) {
    console.error(`Error creating content path for ${filePath}`);

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
