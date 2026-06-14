import { BUILD_CONTEXT } from '../build-context';
import { SUPPORTED_PLUGIN_API_VERSIONS } from './api-version';
import {
  AfterLoadEvent,
  ArtifexPlugin,
  ArtifexPluginHookName,
  ArtifexPluginPaths,
  BeforeFileWriteEvent,
  BeforeFileWriteResult,
  BuildEvent,
  FileEvent,
  WatchReadyEvent,
} from './types';

let plugins: ArtifexPlugin[] = [];
let profileName = '';
let afterLoadEmitted = false;
let afterLoadPending = false;
let pendingAfterLoadEvent: AfterLoadEvent | undefined;

const createPathsSnapshot = (): ArtifexPluginPaths => {
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

const validatePlugin = (plugin: ArtifexPlugin) => {
  if (!plugin.name) {
    throw new Error('Artifex plugin must have a name');
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
  plugin: ArtifexPlugin,
  hookName: ArtifexPluginHookName,
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
      `[artifex:plugin:${plugin.name}] Error in "${hookName}":`,
      error,
    );
  }
};

export const initPlugins = (
  pluginList: ArtifexPlugin[],
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
};

export const getActiveProfile = () => profileName;

export const createBuildEvent = (): BuildEvent => ({
  profile: profileName,
  paths: createPathsSnapshot(),
});

export const createWatchReadyEvent = (): WatchReadyEvent => ({
  profile: profileName,
  paths: createPathsSnapshot(),
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
  hookName: Exclude<ArtifexPluginHookName, 'beforeFileWrite' | 'afterLoad'>,
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
        `[artifex:plugin:${plugin.name}] Error in "beforeFileWrite":`,
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
});
