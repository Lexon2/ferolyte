import { defineCommand } from 'citty';

import { FerolytePack } from '../../ferolyte-pack';
import { collectDiagnostics } from '../../compiler/check/diagnostics-collector';
import { archivePacksIfEnabled } from '../../compiler/archive/create-mcaddon';
import { logger } from '../../compiler/utils/logger';
import { stopPlugins } from '../../compiler/plugins/plugin-host';
import { buildScriptsOnce } from '../../compiler/scripts/watch-esbuild';
import {
  compilerCommandArgs,
  toCompilerOptions,
} from '../shared/compiler-args';

export const runCommand = defineCommand({
  meta: {
    name: 'run',
    description: 'Build packs and scripts once',
  },
  args: {
    ...compilerCommandArgs,
    stats: {
      type: 'boolean',
      description:
        'With --json: print { stats, diagnostics } instead of the diagnostics array',
      default: false,
    },
    json: {
      type: 'boolean',
      description:
        'Print diagnostics as JSON to stdout ({ file, contentType, component, fieldPath, message, severity }[]); exit 1 on errors',
      default: false,
    },
  },
  async run({ args }) {
    const options = toCompilerOptions(args);
    const collector = args.json
      ? collectDiagnostics({ silent: true })
      : undefined;

    if (collector) {
      // stdout carries only the JSON report
      console.log = console.error;
      logger.setLevel('quiet');
    }

    const stats = await FerolytePack.build(options);
    await buildScriptsOnce(options.profile);
    await archivePacksIfEnabled();
    await stopPlugins('build-end');

    if (collector) {
      collector.stop();
      const report = args.stats
        ? { stats, diagnostics: collector.records }
        : collector.records;
      process.stdout.write(`${JSON.stringify(report, null, 2)}
`);
      process.exit(collector.errorCount() > 0 ? 1 : 0);
    }

    process.exit(0);
  },
});
