import { defineCommand } from 'citty';

import { ArtifexPack } from '../../artifex-pack';
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
    await ArtifexPack.build(options);
    await buildScriptsOnce(options.profile);
    process.exit(0);
  },
});
