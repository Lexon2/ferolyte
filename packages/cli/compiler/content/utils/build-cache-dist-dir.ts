import { join } from 'path';

import { BUILD_CONTEXT } from '../../build-context';

/**
 * Gets the build cache dist directory.
 * @returns The build cache dist directory.
 */
export const getBuildCacheDistDir = () =>
  join(BUILD_CONTEXT.PACKS.CACHE_PATH, 'dist');
