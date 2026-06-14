export { ArtifexPluginApiVersion } from './api-version';

export type {
  AfterLoadEvent,
  ArtifexFileKind,
  ArtifexPlugin,
  ArtifexPluginPaths,
  BeforeFileWriteEvent,
  BeforeFileWriteResult,
  BuildEvent,
  FileEvent,
  WatchReadyEvent,
} from './types';
import { ArtifexPlugin } from './types';

export const defineArtifexPlugin = (plugin: ArtifexPlugin): ArtifexPlugin =>
  plugin;
