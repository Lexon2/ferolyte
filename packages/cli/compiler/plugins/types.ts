import { FerolytePluginApiVersion } from './api-version';

export type FerolyteFileKind = 'content' | 'copy';

export interface FerolytePluginPaths {
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
  readonly paths: FerolytePluginPaths;
  readonly files: {
    readonly content: readonly string[];
    readonly copy: readonly string[];
  };
}

export interface BuildEvent {
  readonly profile: string;
  readonly paths: FerolytePluginPaths;
}

export interface WatchReadyEvent {
  readonly profile: string;
  readonly paths: FerolytePluginPaths;
}

export interface FileEvent {
  readonly profile: string;
  readonly sourcePath: string;
  readonly outputPath?: string | readonly string[];
  readonly kind: FerolyteFileKind;
}

export interface BeforeFileWriteEvent {
  readonly profile: string;
  readonly sourcePath: string;
  readonly destinationPath: string;
  readonly data: string | Buffer;
  readonly kind: FerolyteFileKind;
}

export interface BeforeFileWriteResult {
  destinationPath?: string;
  data?: string | Buffer;
  skip?: boolean;
}

export interface FerolytePlugin {
  name: string;
  apiVersion: FerolytePluginApiVersion;
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

export type FerolytePluginHookName = keyof Pick<
  FerolytePlugin,
  | 'afterLoad'
  | 'beforeBuild'
  | 'afterBuild'
  | 'beforeFileWrite'
  | 'afterFileAdd'
  | 'afterFileUpdate'
  | 'afterFileRemove'
  | 'afterWatchReady'
>;
