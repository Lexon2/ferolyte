export { FerolytePluginApiVersion } from './api-version';

export type {
  AfterLoadEvent,
  FerolyteFileKind,
  FerolytePlugin,
  FerolytePluginPaths,
  BeforeFileWriteEvent,
  BeforeFileWriteResult,
  BuildEvent,
  FileEvent,
  WatchReadyEvent,
} from './types';
import { FerolytePlugin } from './types';

export const defineFerolytePlugin = (plugin: FerolytePlugin): FerolytePlugin =>
  plugin;
