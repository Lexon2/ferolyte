import { access } from 'fs/promises';
import { join } from 'path';

import * as esbuild from 'esbuild';

import { BUILD_CONTEXT } from '../build-context';
import { loadConfig } from '../config/load-config';
import { createScriptsOutputPath } from './create-scripts-output-path';
import { MinecraftServer } from './minecraft-reload-server';

let socket: MinecraftServer | undefined;
let started = false;

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
      const reloadCommand = 'reload';

      if (!started) {
        started = true;
        console.log('To use automatic reload type: /connect localhost:8080');
      }

      console.log('Transpilation completed');

      if (!socket) {
        return;
      }

      for (const client of socket.clients) {
        const { status, message } = await client.sendCommand(reloadCommand);
        if (status === 0) {
          client.sendMessage('Scripts and functions reloaded.');
          console.log('Scripts and functions reloaded.');

          return;
        }
        client.sendMessage(`Reload failed.\nError: ${message}`);
      }
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
  plugins: reloadPlugin ? [reloadPlugin] : [],
});

export const buildScriptsOnce = async (profile: string = 'default') => {
  await loadConfig(profile);

  if (!(await hasScriptEntry())) {
    return;
  }

  await esbuild.build(createEsbuildConfig());
};

export const watchScripts = async (profile: string = 'default') => {
  await loadConfig(profile);

  if (!(await hasScriptEntry())) {
    return;
  }

  socket = new MinecraftServer(8080);
  const ctx = await esbuild.context(createEsbuildConfig(createReloadPlugin()));

  await ctx.watch();
  console.log('🚀 Watching for changes...');
};
