import { BUILD_CONTEXT } from '../build-context';
import { SUPPORTED_PLUGIN_API_VERSIONS } from './api-version';
import {
  AfterLoadEvent,
  FerolytePlugin,
  FerolytePluginHookName,
  FerolytePluginPaths,
  BeforeFileWriteEvent,
  BeforeFileWriteResult,
  BuildEvent,
  FerolyteMinecraftContext,
  FileEvent,
  StopEvent,
  StopReason,
  WatchReadyEvent,
} from './types';

let plugins: FerolytePlugin[] = [];
let profileName = '';
let afterLoadEmitted = false;
let afterLoadPending = false;
let pendingAfterLoadEvent: AfterLoadEvent | undefined;
let abortController = new AbortController();
let stopPromise: Promise<void> | undefined;

const BEFORE_STOP_TIMEOUT_MS = 5000;
let minecraftContext: FerolyteMinecraftContext | undefined;

export const setMinecraftContext = (
  context: FerolyteMinecraftContext | undefined,
) => {
  minecraftContext = context;
};

const createPathsSnapshot = (): FerolytePluginPaths => {
  const { PACKS } = BUILD_CONTEXT;

  return {
    inputBase: PACKS.INPUT_BASE_PATH,
    inputBehaviorPack: PACKS.INPUT_BEHAVIOR_PACK_PATH,
    inputResourcePack: PACKS.INPUT_RESOURCE_PACK_PATH,
    outputBehaviorPack: PACKS.OUTPUT_BEHAVIOR_PACK_PATH,
    outputResourcePack: PACKS.OUTPUT_RESOURCE_PACK_PATH,
    outputNamespace: PACKS.OUTPUT_NAMESPACE_PATH,
    scriptEntry: PACKS.SCRIPT_ENTRY_PATH,
    cache: PACKS.CACHE_PATH,
    minGameVersion: PACKS.MIN_GAME_VERSION,
  };
};

const validatePlugin = (plugin: FerolytePlugin) => {
  if (!plugin.name) {
    throw new Error('Ferolyte plugin must have a name');
  }

  if (
    !SUPPORTED_PLUGIN_API_VERSIONS.includes(
      plugin.apiVersion as (typeof SUPPORTED_PLUGIN_API_VERSIONS)[number],
    )
  ) {
    throw new Error(
      `Plugin "${plugin.name}" uses unsupported api_version "${plugin.apiVersion}". Supported: ${SUPPORTED_PLUGIN_API_VERSIONS.join(', ')}`,
    );
  }
};

const runPluginHook = async (
  plugin: FerolytePlugin,
  hookName: FerolytePluginHookName,
  event: unknown,
) => {
  const hook = plugin[hookName];
  if (!hook) {
    return;
  }

  try {
    await (hook as (event: unknown) => unknown).call(plugin, event);
  } catch (error) {
    console.error(
      `[ferolyte:plugin:${plugin.name}] Error in "${hookName}":`,
      error,
    );
  }
};

export const initPlugins = (
  pluginList: FerolytePlugin[],
  activeProfileName: string,
) => {
  for (const plugin of pluginList) {
    validatePlugin(plugin);
  }

  plugins = pluginList;
  profileName = activeProfileName;
  afterLoadEmitted = false;
  afterLoadPending = false;
  pendingAfterLoadEvent = undefined;
  abortController = new AbortController();
  stopPromise = undefined;
};

export const getActiveProfile = () => profileName;

export const createBuildEvent = (): BuildEvent => ({
  profile: profileName,
  paths: createPathsSnapshot(),
});

export const createWatchReadyEvent = (): WatchReadyEvent => ({
  profile: profileName,
  paths: createPathsSnapshot(),
  signal: abortController.signal,
  minecraft: minecraftContext,
});

export const createFileEvent = (
  sourcePath: string,
  kind: FileEvent['kind'],
  outputPath?: string | readonly string[],
): FileEvent => ({
  profile: profileName,
  sourcePath,
  outputPath,
  kind,
});

export const scheduleAfterLoad = (event: AfterLoadEvent) => {
  if (afterLoadEmitted) {
    return;
  }

  pendingAfterLoadEvent = event;
  afterLoadPending = true;
};

export const emitAfterLoad = async () => {
  if (afterLoadEmitted || !afterLoadPending || !pendingAfterLoadEvent) {
    return;
  }

  afterLoadEmitted = true;
  afterLoadPending = false;

  for (const plugin of plugins) {
    await runPluginHook(plugin, 'afterLoad', pendingAfterLoadEvent);
  }

  pendingAfterLoadEvent = undefined;
};

export const emitHook = async (
  hookName: Exclude<FerolytePluginHookName, 'beforeFileWrite' | 'afterLoad' | 'beforeStop'>,
  event: BuildEvent | FileEvent | WatchReadyEvent,
) => {
  for (const plugin of plugins) {
    await runPluginHook(plugin, hookName, event);
  }
};

export const emitBeforeFileWrite = async (
  event: BeforeFileWriteEvent,
): Promise<BeforeFileWriteResult> => {
  const result: BeforeFileWriteResult = {
    destinationPath: event.destinationPath,
    data: event.data,
    skip: false,
  };

  for (const plugin of plugins) {
    if (!plugin.beforeFileWrite) {
      continue;
    }

    try {
      const pluginResult = await plugin.beforeFileWrite({
        ...event,
        destinationPath: result.destinationPath ?? event.destinationPath,
        data: result.data ?? event.data,
      });

      if (!pluginResult) {
        continue;
      }

      if (pluginResult.destinationPath !== undefined) {
        result.destinationPath = pluginResult.destinationPath;
      }

      if (pluginResult.data !== undefined) {
        result.data = pluginResult.data;
      }

      if (pluginResult.skip === true) {
        result.skip = true;
      }
    } catch (error) {
      console.error(
        `[ferolyte:plugin:${plugin.name}] Error in "beforeFileWrite":`,
        error,
      );
    }
  }

  return result;
};

export const createBeforeFileWriteEvent = (
  sourcePath: string,
  destinationPath: string,
  data: string | Buffer,
  kind: BeforeFileWriteEvent['kind'],
): BeforeFileWriteEvent => ({
  profile: profileName,
  sourcePath,
  destinationPath,
  data,
  kind,
});

export const createAfterLoadEvent = (
  files: AfterLoadEvent['files'],
): AfterLoadEvent => ({
  profile: profileName,
  paths: createPathsSnapshot(),
  files,
  signal: abortController.signal,
  minecraft: minecraftContext,
});

const runBeforeStop = async (plugin: FerolytePlugin, event: StopEvent) => {
  if (!plugin.beforeStop) {
    return;
  }

  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      console.error(
        `[ferolyte:plugin:${plugin.name}] "beforeStop" timed out after ${BEFORE_STOP_TIMEOUT_MS} ms`,
      );
      resolve();
    }, BEFORE_STOP_TIMEOUT_MS);
  });

  try {
    await Promise.race([runPluginHook(plugin, 'beforeStop', event), timeout]);
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Aborts plugin signals and calls `beforeStop` on every plugin.
 * Idempotent: repeated calls return the same promise. Never throws.
 */
export const stopPlugins = (reason: StopReason): Promise<void> => {
  if (stopPromise) {
    return stopPromise;
  }

  stopPromise = (async () => {
    abortController.abort();
    const event: StopEvent = { profile: profileName, reason };

    await Promise.all(plugins.map((plugin) => runBeforeStop(plugin, event)));
  })();

  return stopPromise;
};
