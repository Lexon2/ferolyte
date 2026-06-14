import { join } from 'path';

import { ClientEntityBuilder } from '@artifex/pack/content/client-entity/client-entity-builder';
import { BUILD_CONTEXT } from '../../build-context';
import { formatFileName } from '../utils/format-file-name';
import { writeFileByPath } from '../utils/write-file-by-path';
import { ContentBuildOptions } from '../../actions/options';

export const buildClientEntityJson = async (
  filePath: string,
  builder: ClientEntityBuilder,
  _options: ContentBuildOptions = { debug: true, diagnostics: true },
): Promise<string | undefined> => {
  const json = builder.build();
  const jsonString = JSON.stringify(json, null, 2);

  const identifier = builder.cloneConfig().identifier ?? '';
  const fileName = formatFileName(identifier.split(':')[1], '.ce.json');
  if (identifier === undefined || fileName === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  const { OUTPUT_NAMESPACE_PATH, OUTPUT_RESOURCE_PACK_PATH } =
    BUILD_CONTEXT.PACKS;

  const outFile = join(
    OUTPUT_RESOURCE_PACK_PATH,
    'entity',
    OUTPUT_NAMESPACE_PATH,
    fileName,
  );

  // const outFile = createContentPath(filePath, builder.metadata);
  if (outFile === undefined) {
    console.error(`Error creating content path for ${filePath}`);

    return;
  }

  await writeFileByPath(outFile, jsonString, 'utf-8');

  return outFile;
};
