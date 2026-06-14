#!/usr/bin/env node

import { defineCommand, runMain } from 'citty';

import { runCommand } from './commands/run';
import { watchCommand } from './commands/watch';

const main = defineCommand({
  meta: {
    name: 'artifex',
    description: 'Artifex pack compiler for Minecraft BE addons',
    version: '0.1.0',
  },
  subCommands: {
    run: runCommand,
    watch: watchCommand,
  },
});

runMain(main);
