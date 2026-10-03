import { join } from 'path';

import { BuildOptions } from 'esbuild';

import { BUILD_CONTEXT } from '../../build-context';
import { jsoncEsbuildPlugin } from './jsonc-esbuild-plugin';
import { stubMinecraftPlugin } from './stub-minecraft-plugin';
import { externalSdkPlugin } from './external-sdk-plugin';
import { idsPlaceholderPlugin } from './ids-placeholder-plugin';

export interface BundleOptions {
  /** Replace `@minecraft/*` imports with an inert stub (used by `ferolyte inspect`). */
  stubMinecraft?: boolean;
  /** Resolve `@ferolyte/ids` to deep-proxy placeholders (the ids bootstrap pass). */
  placeholderIds?: boolean;
}

export const EXTERNAL_MODULES = [
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
];

/**
 * esbuild options that bundle content entries into in-memory CommonJS modules.
 * @param entries - Content entry files bundled in a single pass.
 */
export const createEsbuildConfig = (
  entries: string[],
  options: BundleOptions = {},
): BuildOptions => {
  return {
    entryPoints: entries,
    outdir: join(BUILD_CONTEXT.PACKS.CACHE_PATH, 'dist'),
    write: false,
    metafile: true,
    target: 'es2020',
    sourcemap: false,
    bundle: true,
    logLevel: 'silent',
    format: 'cjs',
    platform: 'node',
    alias: BUILD_CONTEXT.TS.ALIASES,
    tsconfig: BUILD_CONTEXT.TS.CONFIG_PATH,
    plugins: [
      ...(options.placeholderIds ? [idsPlaceholderPlugin()] : []),
      externalSdkPlugin(BUILD_CONTEXT.TS.ALIASES),
      ...(options.stubMinecraft ? [stubMinecraftPlugin()] : []),
      jsoncEsbuildPlugin(),
    ],
    external: options.stubMinecraft
      ? EXTERNAL_MODULES.filter((name) => !name.startsWith('@minecraft/'))
      : EXTERNAL_MODULES,
  };
};
