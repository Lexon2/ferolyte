import { unlink } from 'fs/promises';

const outputsBySource = new Map<string, string[]>();

export const clearAllContentOutputs = (): void => {
  outputsBySource.clear();
};

export const getContentOutputs = (sourcePath: string): readonly string[] =>
  outputsBySource.get(sourcePath) ?? [];

const unlinkOutputPaths = async (paths: readonly string[]): Promise<string[]> => {
  const removed: string[] = [];

  await Promise.all(
    paths.map(async (outputPath) => {
      try {
        await unlink(outputPath);
        removed.push(outputPath);
      } catch {}
    }),
  );

  return removed;
};

export const replaceContentOutputs = async (
  sourcePath: string,
  newOutputs: readonly string[],
): Promise<string[]> => {
  const previousOutputs = outputsBySource.get(sourcePath) ?? [];
  const newOutputSet = new Set(newOutputs);
  const staleOutputs = previousOutputs.filter(
    (outputPath) => !newOutputSet.has(outputPath),
  );

  const removed = await unlinkOutputPaths(staleOutputs);
  outputsBySource.set(sourcePath, [...newOutputs]);

  return removed;
};

export const deleteAllContentOutputs = async (
  sourcePath: string,
): Promise<string[]> => {
  const outputs = outputsBySource.get(sourcePath) ?? [];
  outputsBySource.delete(sourcePath);

  return unlinkOutputPaths(outputs);
};
