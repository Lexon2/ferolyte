import { join } from 'path';

import { BUILD_CONTEXT } from '../build-context';
import { initPlugins } from '../plugins/plugin-host';
import { applyConfig } from './apply-config';
import { importFerolyteConfig } from './utils/import-config';

export async function loadConfig(profileName: string) {
  if (BUILD_CONTEXT.IS_LOADED) {
    return;
  }
  const configPath = join(process.cwd(), 'ferolyte.config.mts');
  const root = await importFerolyteConfig(configPath);
  if (!root) {
    throw new Error('Ferolyte config not found');
  }

  const config = root.profiles?.[profileName];
  if (!config) {
    const names = Object.keys(root.profiles ?? {}).join(', ') || '(none)';
    throw new Error(`Profile "${profileName}" not found. Available: ${names}`);
  }

  initPlugins(root.plugins ?? [], profileName);
  await applyConfig(config);

  BUILD_CONTEXT.IS_LOADED = true;
}
