#!/usr/bin/env node

import { createRequire } from 'node:module';

import { defineCommand, runMain } from 'citty';

import { runCommand } from './commands/run';
import { watchCommand } from './commands/watch';

const { version } = createRequire(import.meta.url)('../../package.json') as {
  version: string;
};

const main = defineCommand({
  meta: {
    name: 'artifex',
    description: 'Artifex pack compiler for Minecraft BE addons',
    version,
  },
  subCommands: {
    run: runCommand,
    watch: watchCommand,
  },
});

runMain(main);
