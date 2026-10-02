#!/usr/bin/env node

import { createRequire } from 'node:module';

import { defineCommand, runMain } from 'citty';

import { checkCommand } from './commands/check';
import { initCommand } from './commands/init';
import { inspectCommand } from './commands/inspect';
import { runCommand } from './commands/run';
import { typesCommand } from './commands/types';
import { watchCommand } from './commands/watch';

const { version } = createRequire(import.meta.url)('../package.json') as {
  version: string;
};

const main = defineCommand({
  meta: {
    name: 'ferolyte',
    description: 'Ferolyte pack compiler for Minecraft BE addons',
    version,
  },
  subCommands: {
    check: checkCommand,
    init: initCommand,
    inspect: inspectCommand,
    run: runCommand,
    types: typesCommand,
    watch: watchCommand,
  },
});

runMain(main);
