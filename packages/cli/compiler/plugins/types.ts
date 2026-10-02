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

export interface MinecraftConnection {
  readonly id: number;
}

export interface MinecraftCommandResult {
  readonly status: number;
  readonly message: string;
}

export interface MinecraftGameMessage {
  readonly clientId: number;
  readonly purpose: string;
  readonly eventName?: string;
  readonly body: unknown;
}

export interface MinecraftHttpRequest {
  readonly method: string;
  readonly path: string;
  readonly query: Readonly<Record<string, string>>;
  readonly body: unknown;
}

export interface MinecraftHttpResponse {
  readonly status?: number;
  readonly body?: unknown;
}

export type MinecraftHttpHandler = (
  request: MinecraftHttpRequest,
) => MinecraftHttpResponse | unknown | Promise<MinecraftHttpResponse | unknown>;

/**
 * Access to the game connection owned by `ferolyte watch`.
 * Available as `event.minecraft` since API 1.1.0.
 */
export interface FerolyteMinecraftContext {
  readonly clients: readonly MinecraftConnection[];
  sendCommand(
    command: string,
    options?: { clientId?: number; timeoutMs?: number },
  ): Promise<MinecraftCommandResult>;
  scriptEvent(
    id: string,
    message?: string,
    options?: { clientId?: number },
  ): Promise<MinecraftCommandResult>;
  /** Subscribes to a game event (e.g. `PlayerMessage`). Returns an unsubscribe function. */
  subscribe(
    eventName: string,
    handler?: (message: MinecraftGameMessage) => void,
  ): () => void;
  /** Receives every non-response message sent by the game. */
  onMessage(handler: (message: MinecraftGameMessage) => void): () => void;
  /** Present only when `server.http` is enabled. */
  readonly http?: {
    route(method: string, path: string, handler: MinecraftHttpHandler): void;
  };
}

export interface AfterLoadEvent {
  readonly profile: string;
  readonly paths: FerolytePluginPaths;
  readonly files: {
    readonly content: readonly string[];
    readonly copy: readonly string[];
  };
  /** Aborted when plugins are stopped. Available since API 1.1.0. */
  readonly signal: AbortSignal;
  /** Undefined outside watch mode. */
  readonly minecraft?: FerolyteMinecraftContext;
}

export interface BuildEvent {
  readonly profile: string;
  readonly paths: FerolytePluginPaths;
}

export interface WatchReadyEvent {
  readonly profile: string;
  readonly paths: FerolytePluginPaths;
  /** Aborted when plugins are stopped. Available since API 1.1.0. */
  readonly signal: AbortSignal;
  readonly minecraft?: FerolyteMinecraftContext;
}

export type StopReason = 'signal' | 'error' | 'build-end';

export interface StopEvent {
  readonly profile: string;
  readonly reason: StopReason;
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
  /** Called once on shutdown (5 s timeout). Available since API 1.1.0. */
  beforeStop?(event: StopEvent): void | Promise<void>;
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
  | 'beforeStop'
>;
