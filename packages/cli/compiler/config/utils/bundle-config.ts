import { mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import * as esbuild from 'esbuild';

import { readTsconfigAliases } from './read-tsconfig-aliases';

export const bundleFerolyteConfig = async (
  configPath: string,
  cwd: string = process.cwd(),
): Promise<string> => {
  const cacheDir = join(cwd, '.ferolyte', 'cache');
  await mkdir(cacheDir, { recursive: true });

  const outFile = join(cacheDir, `config-${Date.now()}.mjs`);
  const tsconfigPath = join(cwd, 'tsconfig.json');
  const aliases = await readTsconfigAliases(cwd);

  try {
    await esbuild.build({
      entryPoints: [configPath],
      outfile: outFile,
      allowOverwrite: true,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'es2020',
      packages: 'external',
      alias: aliases,
      ...(existsSync(tsconfigPath) ? { tsconfig: tsconfigPath } : {}),
      logLevel: 'silent',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    throw new Error(`Failed to bundle Ferolyte config: ${message}`);
  }

  return outFile;
};

export const importBundledConfig = async <T>(
  bundledPath: string,
): Promise<T> => {
  const url = pathToFileURL(bundledPath).href;
  const module = await import(url);

  return module.default as T;
};

export const cleanupBundledConfig = async (
  bundledPath: string,
): Promise<void> => {
  try {
    await unlink(bundledPath);
  } catch {
    // Ignore cleanup errors for temp files.
  }
};
