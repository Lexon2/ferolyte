import { defineCommand } from 'citty';

import { FerolytePack } from '../../ferolyte-pack';
import { watchScripts } from '../../compiler/scripts/watch-esbuild';
import {
  compilerCommandArgs,
  toCompilerOptions,
} from '../shared/compiler-args';

export const watchCommand = defineCommand({
  meta: {
    name: 'watch',
    description: 'Watch packs and scripts for changes',
  },
  args: compilerCommandArgs,
  async run({ args }) {
    const options = toCompilerOptions(args);
    await FerolytePack.watch(options);
    await watchScripts(options.profile);
  },
});
