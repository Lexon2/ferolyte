import { BuildOptions } from 'esbuild';

import { BUILD_CONTEXT } from '../../build-context';

export const createEsbuildConfig = (
  entry: string,
  outFile: string,
): BuildOptions => {
  return {
    entryPoints: [entry],
    outfile: outFile,
    allowOverwrite: true,
    target: 'es2020',
    sourcemap: false,
    bundle: true,
    format: 'esm',
    alias: BUILD_CONTEXT.TS.ALIASES,
    tsconfig: BUILD_CONTEXT.TS.CONFIG_PATH,
    external: [
      '@minecraft/server',
      '@minecraft/server-ui',
      '@minecraft/server-net',
      '@minecraft/server-admin',
      '@minecraft/server-editor',
      '@minecraft/server-gametest',
      '@minecraft/server-editor-bindings',
      '@minecraft/debug-utilities',
      'fs',
      'path',
    ],
  };
};
