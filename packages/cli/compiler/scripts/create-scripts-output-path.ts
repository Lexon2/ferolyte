import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';

export const createScriptsOutputPath = () => {
  return join(
    BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH,
    'scripts',
    BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH,
  );
};
