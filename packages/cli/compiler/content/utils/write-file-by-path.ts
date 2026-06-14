import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export const writeFileByPath = async (
  filePath: string,
  data: string | Buffer,
  encoding: BufferEncoding = 'utf-8',
): Promise<void> => {
  const directoryPath = dirname(filePath);
  try {
    await mkdir(directoryPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directories for ${filePath}:`, error);

    return;
  }

  await writeFile(filePath, data, encoding);
};
