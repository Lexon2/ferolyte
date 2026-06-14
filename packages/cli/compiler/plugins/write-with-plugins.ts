import { readFile } from 'fs/promises';

import { writeFileByPath } from '../content/utils/write-file-by-path';
import { ArtifexFileKind } from './types';
import { createBeforeFileWriteEvent, emitBeforeFileWrite } from './plugin-host';

export interface WriteWithPluginsResult {
  written: boolean;
  destinationPath: string;
}

export const writeWithPlugins = async (
  sourcePath: string,
  destinationPath: string,
  data: string | Buffer,
  kind: ArtifexFileKind,
  encoding: BufferEncoding = 'utf-8',
): Promise<WriteWithPluginsResult> => {
  const event = createBeforeFileWriteEvent(
    sourcePath,
    destinationPath,
    data,
    kind,
  );
  const result = await emitBeforeFileWrite(event);

  const finalDestination = result.destinationPath ?? destinationPath;

  if (result.skip) {
    return {
      written: false,
      destinationPath: finalDestination,
    };
  }

  const finalData = result.data ?? data;
  await writeFileByPath(finalDestination, finalData, encoding);

  return {
    written: true,
    destinationPath: finalDestination,
  };
};

export const copyWithPlugins = async (
  sourcePath: string,
  destinationPath: string,
): Promise<WriteWithPluginsResult> => {
  const data = await readFile(sourcePath);

  return writeWithPlugins(sourcePath, destinationPath, data, 'copy');
};
