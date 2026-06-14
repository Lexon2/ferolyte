import { ArtifexPluginApiVersion } from './api-version';

export type ArtifexFileKind = 'content' | 'copy';

export interface ArtifexPluginPaths {
  readonly inputBase: string;
  readonly inputBehaviorPack: string;
  readonly inputResourcePack: string;
  readonly outputBehaviorPack: string;
  readonly outputResourcePack: string;
  readonly outputNamespace: string;
  readonly scriptEntry: string;
  readonly cache: string;
  readonly minGameVersion: string;
}

export interface AfterLoadEvent {
  readonly profile: string;
  readonly paths: ArtifexPluginPaths;
  readonly files: {
    readonly content: readonly string[];
    readonly copy: readonly string[];
  };
}

export interface BuildEvent {
  readonly profile: string;
  readonly paths: ArtifexPluginPaths;
}

export interface WatchReadyEvent {
  readonly profile: string;
  readonly paths: ArtifexPluginPaths;
}

export interface FileEvent {
  readonly profile: string;
  readonly sourcePath: string;
  readonly outputPath?: string | readonly string[];
  readonly kind: ArtifexFileKind;
}

export interface BeforeFileWriteEvent {
  readonly profile: string;
  readonly sourcePath: string;
  readonly destinationPath: string;
  readonly data: string | Buffer;
  readonly kind: ArtifexFileKind;
}

export interface BeforeFileWriteResult {
  destinationPath?: string;
  data?: string | Buffer;
  skip?: boolean;
}

export interface ArtifexPlugin {
  name: string;
  apiVersion: ArtifexPluginApiVersion;
  afterLoad?(event: AfterLoadEvent): void | Promise<void>;
  beforeBuild?(event: BuildEvent): void | Promise<void>;
  afterBuild?(event: BuildEvent): void | Promise<void>;
  beforeFileWrite?(
    event: BeforeFileWriteEvent,
  ): BeforeFileWriteResult | void | Promise<BeforeFileWriteResult | void>;
  afterFileAdd?(event: FileEvent): void | Promise<void>;
  afterFileUpdate?(event: FileEvent): void | Promise<void>;
  afterFileRemove?(event: FileEvent): void | Promise<void>;
  afterWatchReady?(event: WatchReadyEvent): void | Promise<void>;
}

export type ArtifexPluginHookName = keyof Pick<
  ArtifexPlugin,
  | 'afterLoad'
  | 'beforeBuild'
  | 'afterBuild'
  | 'beforeFileWrite'
  | 'afterFileAdd'
  | 'afterFileUpdate'
  | 'afterFileRemove'
  | 'afterWatchReady'
>;
