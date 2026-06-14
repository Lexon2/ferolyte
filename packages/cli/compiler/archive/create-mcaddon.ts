import { writeFile } from 'fs/promises';
import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { addDirectoryToZipWriter } from './create-directory-zip';
import { ZipWriter } from './zip-writer';

export const createMcaddon = async (): Promise<string | undefined> => {
  const {
    PACK_ALIAS,
    OUTPUT_BEHAVIOR_PACK_PATH,
    OUTPUT_RESOURCE_PACK_PATH,
  } = BUILD_CONTEXT.PACKS;

  const packAlias = PACK_ALIAS.toUpperCase();
  const writer = new ZipWriter();

  const [hasBehaviorPack, hasResourcePack] = await Promise.all([
    addDirectoryToZipWriter(
      writer,
      OUTPUT_BEHAVIOR_PACK_PATH,
      `${packAlias}_BP`,
    ),
    addDirectoryToZipWriter(
      writer,
      OUTPUT_RESOURCE_PACK_PATH,
      `${packAlias}_RP`,
    ),
  ]);

  if (!hasBehaviorPack && !hasResourcePack) {
    return undefined;
  }

  const mcaddonBuffer = await writer.finish();
  const outputPath = join(process.cwd(), `${PACK_ALIAS}.mcaddon`);
  await writeFile(outputPath, mcaddonBuffer);

  return outputPath;
};

export const archivePacksIfEnabled = async (): Promise<string | undefined> => {
  if (!BUILD_CONTEXT.PACKS.ARCHIVE) {
    return undefined;
  }

  return createMcaddon();
};
