import { logger } from '../utils/logger';
import { readFile } from 'fs/promises';

import { BUILD_CONTEXT } from '../build-context';
import { serializeJson } from '../content/utils/serialize-json';
import { writeFileByPath } from '../content/utils/write-file-by-path';
import { parseJsonc } from '../utils/read-jsonc';
import { FerolyteFileKind } from './types';
import { createBeforeFileWriteEvent, emitBeforeFileWrite } from './plugin-host';

export interface WriteWithPluginsResult {
  written: boolean;
  destinationPath: string;
}

const normalizeJsonData = (
  sourcePath: string,
  destinationPath: string,
  data: string | Buffer,
  kind: FerolyteFileKind,
): string | Buffer => {
  if (
    !destinationPath.endsWith('.json') ||
    (kind !== 'copy' && !BUILD_CONTEXT.PACKS.MINIFY_JSON)
  ) {
    return data;
  }

  const text = typeof data === 'string' ? data : data.toString('utf-8');
  const result = parseJsonc(text);

  if (!result.ok) {
    const [first] = result.errors;
    logger.warn(
      `Invalid JSONC, copied as is: ${sourcePath}:${first.line}:${first.column + 1}: ${first.message}`,
    );
    return data;
  }

  if (result.value === undefined) {
    return data;
  }

  return serializeJson(result.value);
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
  const finalData = normalizeJsonData(
    sourcePath,
    finalDestination,
    rawData,
    kind,
  );
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
