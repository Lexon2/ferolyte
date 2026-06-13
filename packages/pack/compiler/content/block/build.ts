import { join } from 'path';

import { BlockBuilder } from '../../../content/block/block-builder';
import { BUILD_CONTEXT } from '../../build-context';
import { formatFileName } from '../utils/format-file-name';
import { writeFileByPath } from '../utils/write-file-by-path';

export const buildBlockJson = async (
  filePath: string,
  builder: BlockBuilder,
  debug: boolean = true,
): Promise<string | undefined> => {
  builder.withBuildContext({
    sourceFile: filePath,
    identifier: builder.cloneConfig().identifier,
    debug,
    contentType: 'block',
  });

  const json = builder.build();
  const jsonString = JSON.stringify(json, null, 2);

  const identifier = builder.cloneConfig().identifier ?? '';
  const fileName = formatFileName(identifier.split(':')[1], '.block.json');
  if (identifier === undefined || fileName === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }
  const { OUTPUT_NAMESPACE_PATH, OUTPUT_BEHAVIOR_PACK_PATH } =
    BUILD_CONTEXT.PACKS;

  const outFile = join(
    OUTPUT_BEHAVIOR_PACK_PATH,
    'blocks',
    OUTPUT_NAMESPACE_PATH,
    fileName,
  );

  // const outFile = createContentPath(filePath, builder[i].metadata);
  // if (outFile === undefined) {
  //   console.error(`Error creating content path for ${filePath}`);

  //   return;
  // }

  await writeFileByPath(outFile, jsonString, 'utf-8');

  return outFile;
};
