import { access } from 'fs/promises';
import { join } from 'path';

import * as esbuild from 'esbuild';

import { BUILD_CONTEXT } from '../build-context';
import { loadConfig } from '../config/load-config';
import { jsoncEsbuildPlugin } from '../core/utils/jsonc-esbuild-plugin';
import { createScriptsOutputPath } from './create-scripts-output-path';
import { getMinecraftHub } from './start-minecraft-server';


const hasScriptEntry = async () => {
  try {
    await access(BUILD_CONTEXT.PACKS.SCRIPT_ENTRY_PATH);
    return true;
  } catch {
    return false;
  }
};

const createReloadPlugin = (): esbuild.Plugin => ({
  name: 'ReloadPlugin',
  setup(build) {
    build.onEnd(async () => {
      console.log('Transpilation completed');

      await getMinecraftHub()?.reloadAll();
    });
  },
});

const createEsbuildConfig = (reloadPlugin?: esbuild.Plugin): esbuild.BuildOptions => ({
  entryPoints: [BUILD_CONTEXT.PACKS.SCRIPT_ENTRY_PATH],
  bundle: true,
  minify: BUILD_CONTEXT.PACKS.SCRIPT_MINIFY,
  allowOverwrite: true,
  sourcemap: false,
  target: 'es2020',
  format: 'esm',
  tsconfig: BUILD_CONTEXT.TS.CONFIG_PATH.replace(
    'tsconfig.json',
    'tsconfig.scripts.json',
  ),
  outfile: join(createScriptsOutputPath(), 'index.js'),
  alias: BUILD_CONTEXT.TS.ALIASES,
  external: [
    '@minecraft/server',
    '@minecraft/server-ui',
    '@minecraft/server-net',
    '@minecraft/server-admin',
    '@minecraft/server-editor',
    '@minecraft/server-gametest',
    '@minecraft/server-editor-bindings',
    '@minecraft/debug-utilities',
  ],
  plugins: reloadPlugin
    ? [jsoncEsbuildPlugin(), reloadPlugin]
    : [jsoncEsbuildPlugin()],
});

export const buildScriptsOnce = async (profile: string = 'default') => {
  await loadConfig(profile);

  if (!(await hasScriptEntry())) {
    return;
  }

  await esbuild.build(createEsbuildConfig());
};

export const watchScripts = async (
  profile: string = 'default',
): Promise<() => Promise<void>> => {
  await loadConfig(profile);

  if (!(await hasScriptEntry())) {
    return async () => {};
  }

  const ctx = await esbuild.context(createEsbuildConfig(createReloadPlugin()));

  await ctx.watch();
  console.log('🚀 Watching for changes...');

  return async () => {
    await ctx.dispose();
  };
};
