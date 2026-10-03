export { FerolytePluginApiVersion } from './api-version';
export { httpResponse } from './http-response';

export type {
  AfterLoadEvent,
  AfterScriptBuildEvent,
  FerolyteServerInfo,
  MinecraftChatMessage,
  MinecraftCommandEvent,
  MinecraftReloadEvent,
  MinecraftReloadTrigger,
  FerolyteFileKind,
  FerolytePlugin,
  FerolytePluginPaths,
  BeforeFileWriteEvent,
  BeforeFileWriteResult,
  BuildEvent,
  FerolyteMinecraftContext,
  FileEvent,
  MinecraftCommandResult,
  MinecraftConnection,
  MinecraftGameMessage,
  MinecraftHttpHandler,
  MinecraftHttpRequest,
  MinecraftHttpResponse,
  StopEvent,
  StopReason,
  WatchReadyEvent,
} from './types';
import { FerolytePlugin } from './types';

export const defineFerolytePlugin = (plugin: FerolytePlugin): FerolytePlugin =>
  plugin;
