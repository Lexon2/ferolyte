import { defineCommand } from 'citty';

import { FerolytePack } from '../../ferolyte-pack';
import { archivePacksIfEnabled } from '../../compiler/archive/create-mcaddon';
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
  args: compilerCommandArgs,
  async run({ args }) {
    const options = toCompilerOptions(args);
    await FerolytePack.build(options);
    await buildScriptsOnce(options.profile);
    await archivePacksIfEnabled();
    process.exit(0);
  },
});
