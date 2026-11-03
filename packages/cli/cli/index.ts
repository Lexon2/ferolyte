#!/usr/bin/env node

import { createRequire } from 'node:module';

import { defineCommand, runMain } from 'citty';

const { version } = createRequire(import.meta.url)('../package.json') as {
  version: string;
};

const main = defineCommand({
  meta: {
    name: 'ferolyte',
    description: 'Ferolyte pack compiler for Minecraft BE addons',
    version,
  },
  // Loaded on use: `run` / `check` do not load the scaffolding, the watcher or the WebSocket hub.
  subCommands: {
    check: () => import('./commands/check.js').then((m) => m.checkCommand),
    init: () => import('./commands/init.js').then((m) => m.initCommand),
    inspect: () => import('./commands/inspect.js').then((m) => m.inspectCommand),
    run: () => import('./commands/run.js').then((m) => m.runCommand),
    types: () => import('./commands/types.js').then((m) => m.typesCommand),
    watch: () => import('./commands/watch.js').then((m) => m.watchCommand),
  },
});

runMain(main);
