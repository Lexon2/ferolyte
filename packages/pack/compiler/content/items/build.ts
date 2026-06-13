import { join } from 'path';

import { ItemBuilder } from '../../../content/item/item-builder';
import { BUILD_CONTEXT } from '../../build-context';
import { formatFileName } from '../utils/format-file-name';
import { writeFileByPath } from '../utils/write-file-by-path';

export const buildItemJson = async (
  filePath: string,
  builder: ItemBuilder,
): Promise<string | undefined> => {
  // const source = builder.cloneConfig();

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

  await writeFileByPath(outFile, jsonString, 'utf-8');

  return outFile;
};
