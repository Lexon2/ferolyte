import { logger } from '../../utils/logger';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

/** Folders this process created (or found): a write into one of them skips the mkdir. */
const knownFolders = new Set<string>();
/** mkdir calls in flight, shared by the files of the same folder. */
const pendingFolders = new Map<string, Promise<void>>();

const createFolder = (directoryPath: string): Promise<void> => {
  let pending = pendingFolders.get(directoryPath);
  if (!pending) {
    pending = mkdir(directoryPath, { recursive: true })
      .then(() => {
        knownFolders.add(directoryPath);
      })
      .finally(() => {
        pendingFolders.delete(directoryPath);
      });
    pendingFolders.set(directoryPath, pending);
  }

  return pending;
};

/** The write failed because a folder of the path is missing (or is not a folder). */
const isMissingFolder = (error: unknown): boolean => {
  const code = (error as NodeJS.ErrnoException | undefined)?.code;

  return code === 'ENOENT' || code === 'ENOTDIR';
};

export const writeFileByPath = async (
  filePath: string,
  data: string | Buffer,
  encoding: BufferEncoding = 'utf-8',
): Promise<void> => {
  const directoryPath = dirname(filePath);

  // One mkdir per folder instead of one per file. A folder removed since (a new build cleared the output)
  // fails the write with ENOENT and is created again below.
  if (knownFolders.has(directoryPath)) {
    try {
      await writeFile(filePath, data, encoding);

      return;
    } catch (error) {
      if (!isMissingFolder(error)) {
        throw error;
      }
      knownFolders.delete(directoryPath);
    }
  }

  try {
    await createFolder(directoryPath);
  } catch (error) {
    logger.error(`Error creating directories for ${filePath}:`, error);

    return;
  }

  await writeFile(filePath, data, encoding);
};
