import { defineCommand } from 'citty';

import { generateTypes } from '../../compiler/registry/generate-types';
import { logger } from '../../compiler/utils/logger';
import { profileArg } from '../shared/compiler-args';

export const typesCommand = defineCommand({
  meta: {
    name: 'types',
    description:
      'Generate .ferolyte/types/ids.ts (typed ids of entities, items, blocks, animations, ...) importable as @ferolyte/ids',
  },
  args: {
    profile: profileArg,
  },
  async run({ args }) {
    const result = await generateTypes(args.profile);

    logger.info(
      `${result.written ? '✓ wrote' : '✓ up to date'} ${result.file} (${result.files} content file(s))`,
    );
    for (const failure of result.failed) {
      logger.error(`✖ ${failure.split('\n')[0]}`);
    }

    process.exit(result.failed.length > 0 ? 1 : 0);
  },
});
