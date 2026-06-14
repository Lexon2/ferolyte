import { access, readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';

import { ZipWriter } from './zip-writer';

const SKIP_DIRECTORIES = new Set(['node_modules', '.git', '.artifex', 'dist']);

async function* walkDirectoryFiles(
  dir: string,
  rootDir: string,
): AsyncGenerator<{ relativePath: string; absolutePath: string }> {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name)) {
        continue;
      }

      yield* walkDirectoryFiles(absolutePath, rootDir);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    yield {
      relativePath: relative(rootDir, absolutePath).replace(/\\/g, '/'),
      absolutePath,
    };
  }
}

const directoryHasFiles = async (dir: string): Promise<boolean> => {
  try {
    await access(dir);
  } catch {
    return false;
  }

  for await (const _file of walkDirectoryFiles(dir, dir)) {
    return true;
  }

  return false;
};

export const addDirectoryToZipWriter = async (
  writer: ZipWriter,
  directoryPath: string,
  entryPrefix: string,
): Promise<boolean> => {
  const hasFiles = await directoryHasFiles(directoryPath);
  if (!hasFiles) {
    return false;
  }

  const normalizedPrefix = entryPrefix
    ? `${entryPrefix.replace(/\\/g, '/').replace(/\/?$/, '/')}`
    : '';

  for await (const file of walkDirectoryFiles(directoryPath, directoryPath)) {
    const data = await readFile(file.absolutePath);
    const entryName = normalizedPrefix
      ? `${normalizedPrefix}${file.relativePath}`
      : file.relativePath;
    writer.addEntry(entryName, data);
  }

  return true;
};

export const createDirectoryZip = async (
  directoryPath: string,
): Promise<Buffer | undefined> => {
  const writer = new ZipWriter();
  const hasFiles = await addDirectoryToZipWriter(writer, directoryPath, '');

  if (!hasFiles) {
    return undefined;
  }

  return writer.finish();
};
