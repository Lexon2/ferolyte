import { defineCommand } from 'citty';

import { FerolytePack } from '../../ferolyte-pack';
import { loadConfig } from '../../compiler/config/load-config';
import { logger } from '../../compiler/utils/logger';
import { stopPlugins } from '../../compiler/plugins/plugin-host';
import { startMinecraftServer } from '../../compiler/scripts/start-minecraft-server';
import { watchScripts } from '../../compiler/scripts/watch-esbuild';
import {
  compilerCommandArgs,
  toCompilerOptions,
} from '../shared/compiler-args';

type StopReason = Parameters<typeof stopPlugins>[0];

export const watchCommand = defineCommand({
  meta: {
    name: 'watch',
    description: 'Watch packs and scripts for changes',
  },
  args: compilerCommandArgs,
  async run({ args }) {
    const options = toCompilerOptions(args);
    const disposers: Array<() => Promise<void>> = [];
    let shuttingDown = false;

    const shutdown = async (reason: StopReason, exitCode: number) => {
      if (shuttingDown) {
        // Second Ctrl+C / signal forces exit.
        process.exit(exitCode);
      }
      shuttingDown = true;

      try {
        await stopPlugins(reason);
        await Promise.allSettled(disposers.map((dispose) => dispose()));
      } finally {
        process.exit(exitCode);
      }
    };

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    if (process.platform === 'win32') {
      signals.push('SIGBREAK');
    }
    for (const signal of signals) {
      process.on(signal, () => void shutdown('signal', 0));
    }
    process.on('uncaughtException', (error) => {
      logger.error(String(error instanceof Error ? error.stack ?? error.message : error));
      void shutdown('error', 1);
    });

    await loadConfig(options.profile);
    disposers.push(await startMinecraftServer());
    disposers.push(await FerolytePack.watch(options));
    disposers.push(await watchScripts(options.profile));
  },
});
