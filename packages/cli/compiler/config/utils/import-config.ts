import { dirname } from 'node:path';

import { isEsmFile } from './is-esm-file';
import { FerolyteConfig } from '../interfaces/config';
import {
  bundleFerolyteConfig,
  cleanupBundledConfig,
  importBundledConfig,
} from './bundle-config';

export const importFerolyteConfig = async (
  path: string,
): Promise<FerolyteConfig | undefined> => {
  if (!isEsmFile(path)) {
    return undefined;
  }

  const cwd = dirname(path);
  const bundledPath = await bundleFerolyteConfig(path, cwd);

  try {
    return await importBundledConfig<FerolyteConfig>(bundledPath);
  } finally {
    await cleanupBundledConfig(bundledPath);
  }
};
