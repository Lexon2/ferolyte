import { readFile } from 'fs/promises';
import { parse as parseJsonc } from 'jsonc-parser';

import { BUILD_CONTEXT } from '../build-context';
import { writeFileByPath } from '../content/utils/write-file-by-path';
import { FerolyteFileKind } from './types';
import { createBeforeFileWriteEvent, emitBeforeFileWrite } from './plugin-host';

export interface WriteWithPluginsResult {
  written: boolean;
  destinationPath: string;
}

const minifyJsonData = (
  destinationPath: string,
  data: string | Buffer,
): string | Buffer => {
  if (!BUILD_CONTEXT.PACKS.MINIFY_JSON || !destinationPath.endsWith('.json')) {
    return data;
  }

  const text = typeof data === 'string' ? data : data.toString('utf-8');

  try {
    const parsed = parseJsonc(text);
    if (parsed === undefined) {
      return data;
    }

    return JSON.stringify(parsed);
  } catch {
    return data;
  }
};

export const writeWithPlugins = async (
  sourcePath: string,
  destinationPath: string,
  data: string | Buffer,
  kind: FerolyteFileKind,
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

  const rawData = result.data ?? data;
  const finalData = minifyJsonData(finalDestination, rawData);
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
