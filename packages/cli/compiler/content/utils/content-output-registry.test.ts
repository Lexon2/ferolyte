import { mkdir, writeFile, access } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  clearAllContentOutputs,
  deleteAllContentOutputs,
  getContentOutputs,
  replaceContentOutputs,
} from './content-output-registry';

const tempRoots: string[] = [];

const createTempRoot = async (): Promise<string> => {
  const root = join(
    tmpdir(),
    `ferolyte-content-output-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  await mkdir(root, { recursive: true });
  tempRoots.push(root);
  return root;
};

const createOutputFile = async (
  root: string,
  name: string,
): Promise<string> => {
  const filePath = join(root, name);
  await writeFile(filePath, '{}', 'utf-8');
  return filePath;
};

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

describe('content-output-registry', () => {
  beforeEach(() => {
    clearAllContentOutputs();
  });

  afterEach(async () => {
    clearAllContentOutputs();
  });

  it('registers outputs without deleting on first replace', async () => {
    const root = await createTempRoot();
    const source = join(root, 'packs', 'BP', 'blocks', 'test.b.ts');
    const outputA = await createOutputFile(root, 'test_1.b.json');
    const outputB = await createOutputFile(root, 'test_2.b.json');

    const removed = await replaceContentOutputs(source, [outputA, outputB]);

    expect(removed).toEqual([]);
    expect(getContentOutputs(source)).toEqual([outputA, outputB]);
    expect(await fileExists(outputA)).toBe(true);
    expect(await fileExists(outputB)).toBe(true);
  });

  it('removes stale outputs on replace', async () => {
    const root = await createTempRoot();
    const source = join(root, 'packs', 'BP', 'blocks', 'test.b.ts');
    const outputA = await createOutputFile(root, 'test_1.b.json');
    const outputB = await createOutputFile(root, 'test_2.b.json');
    const outputC = await createOutputFile(root, 'test_3.b.json');

    await replaceContentOutputs(source, [outputA, outputB, outputC]);

    const removed = await replaceContentOutputs(source, [outputA, outputB]);

    expect(removed).toEqual([outputC]);
    expect(getContentOutputs(source)).toEqual([outputA, outputB]);
    expect(await fileExists(outputC)).toBe(false);
    expect(await fileExists(outputA)).toBe(true);
    expect(await fileExists(outputB)).toBe(true);
  });

  it('deletes all outputs for a source', async () => {
    const root = await createTempRoot();
    const source = join(root, 'packs', 'BP', 'blocks', 'test.b.ts');
    const outputA = await createOutputFile(root, 'test_1.b.json');
    const outputB = await createOutputFile(root, 'test_2.b.json');

    await replaceContentOutputs(source, [outputA, outputB]);

    const removed = await deleteAllContentOutputs(source);

    expect(removed.sort()).toEqual([outputA, outputB].sort());
    expect(getContentOutputs(source)).toEqual([]);
    expect(await fileExists(outputA)).toBe(false);
    expect(await fileExists(outputB)).toBe(false);
  });

  it('clears tracked outputs', async () => {
    const root = await createTempRoot();
    const source = join(root, 'packs', 'BP', 'blocks', 'test.b.ts');
    const outputA = await createOutputFile(root, 'test_1.b.json');

    await replaceContentOutputs(source, [outputA]);
    clearAllContentOutputs();

    expect(getContentOutputs(source)).toEqual([]);
    expect(await fileExists(outputA)).toBe(true);
  });
});
