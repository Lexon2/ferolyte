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
  /** Raw `body` of the game's `commandResponse`. API 1.2.0. */
  readonly body?: unknown;
}

/** What triggered a reload of the game. API 1.2.0. */
export type MinecraftReloadTrigger = 'scripts' | 'packs' | 'manual';

/** Result of the `/reload` sent to one client. API 1.2.0. */
export interface MinecraftReloadEvent {
  readonly trigger: MinecraftReloadTrigger;
  readonly clientId: number;
  /** `true` when the game answered with status 0. */
  readonly ok: boolean;
  /** The game's status message, or the error text (timeout, disconnect). */
  readonly message: string;
  /** `Date.now()` when the result arrived. */
  readonly at: number;
  /** Per-hub counter, increases with every event. */
  readonly seq: number;
}

/** Every command the hub sent (also its own `/reload` and `tellraw`). API 1.2.0. */
export interface MinecraftCommandEvent {
  readonly command: string;
  readonly clientId: number;
  readonly requestId: string;
  /** `Date.now()` when the result (or error) arrived. */
  readonly at: number;
  readonly result?: {
    readonly status: number;
    readonly message: string;
    readonly body?: unknown;
  };
  readonly error?: string;
}

/** A chat line, normalised from the `PlayerMessage` event. API 1.2.0. */
export interface MinecraftChatMessage {
  readonly clientId: number;
  readonly sender: string;
  readonly type: string;
  /** Plain text: rawtext flattened, `§` formatting codes removed. */
  readonly text: string;
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
  /** Request headers, names in lower case. API 1.2.0. */
  readonly headers: Readonly<Record<string, string>>;
  /** Aborted when the client closes the connection before the response is written. API 1.2.0. */
  readonly signal: AbortSignal;
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
  /**
   * Result of every reload sent to the game, once per client (API 1.2.0).
   * Returns an unsubscribe function.
   */
  onReload(handler: (event: MinecraftReloadEvent) => void): () => void;
  /**
   * Observes every command the hub sends, including its own reload (API 1.2.0).
   * Called once per command with `result` or `error`.
   */
  onCommand(handler: (event: MinecraftCommandEvent) => void): () => void;
  /**
   * Normalised chat lines (API 1.2.0). Subscribes to `PlayerMessage` on demand; shares the
   * subscription with `subscribe`.
   */
  onChat(handler: (message: MinecraftChatMessage) => void): () => void;
  /** Id of the client commands go to by default (follows `server.clientPolicy`). API 1.2.0. */
  readonly primaryClientId?: number;
  /** Present only when `server.http` is enabled. */
  readonly http?: {
    route(method: string, path: string, handler: MinecraftHttpHandler): void;
  };
}

/** The effective `server` configuration of `ferolyte watch` (API 1.2.0). */
export interface FerolyteServerInfo {
  /** Port of the WebSocket hub (`/connect localhost:<port>`). */
  readonly port: number;
  /** The HTTP API address, or `false` when it is disabled. */
  readonly http: false | { readonly port: number; readonly host: string };
  readonly reloadOnPackChange: boolean;
  readonly clientPolicy: 'newest' | 'oldest';
  /** Command syntax version of the commands sent to the game (`server.commandVersion`). */
  readonly commandVersion: number;
}

export interface AfterScriptBuildEvent {
  readonly profile: string;
  /** `false` when esbuild reported errors. */
  readonly ok: boolean;
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
  /** Effective server config; undefined outside watch mode. API 1.2.0. */
  readonly server?: FerolyteServerInfo;
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
  /** Effective server config; undefined outside watch mode. API 1.2.0. */
  readonly server?: FerolyteServerInfo;
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
  /** After every scripts build in `watch` / `run`. Available since API 1.2.0. */
  afterScriptBuild?(event: AfterScriptBuildEvent): void | Promise<void>;
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
  | 'afterScriptBuild'
  | 'beforeStop'
>;
