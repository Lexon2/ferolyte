import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { logger } from '../../utils/logger';
import { writeFileByPath } from './write-file-by-path';

const roots: string[] = [];

const createRoot = async (): Promise<string> => {
  const root = join(tmpdir(), `ferolyte-write-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  roots.push(root);

  return root;
};

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('writeFileByPath', () => {
  it('creates missing folders, also for many files written at once', async () => {
    const root = await createRoot();
    const files = Array.from({ length: 40 }, (_, i) => join(root, 'a', `d${i % 4}`, `f${i}.json`));
    await Promise.all(files.map((file, i) => writeFileByPath(file, `{"i":${i}}`)));

    expect(await readFile(files[39], 'utf-8')).toBe('{"i":39}');
    expect(await readFile(files[0], 'utf-8')).toBe('{"i":0}');
  });

  it('writes again after the folder was removed (a new build cleared the output)', async () => {
    const root = await createRoot();
    const file = join(root, 'out', 'x', 'a.json');
    await writeFileByPath(file, '1');
    await rm(join(root, 'out'), { recursive: true, force: true });
    await writeFileByPath(file, '2');

    expect(await readFile(file, 'utf-8')).toBe('2');
  });

  it('logs and skips the file when the folder cannot be created', async () => {
    const root = await createRoot();
    await writeFile(join(root, 'blocker'), 'a file, not a folder');
    const error = vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    await expect(writeFileByPath(join(root, 'blocker', 'sub', 'a.json'), '1')).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
