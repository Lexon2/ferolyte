import { randomUUID } from 'crypto';

import { WebSocketServer, WebSocket } from 'ws';

import type {
  MinecraftChatMessage,
  MinecraftCommandEvent,
  MinecraftCommandResult,
  MinecraftConnection,
  MinecraftGameMessage,
  MinecraftReloadEvent,
  MinecraftReloadTrigger,
} from '../plugins/types';
import { logger } from '../utils/logger';
import { normalizeChatBody } from './minecraft-chat';

export const COMMAND_TIMEOUT_MS = 20_000;
export const MAX_IN_FLIGHT = 90;
const EVENT_BUFFER_SIZE = 500;
const RELOAD_DEBOUNCE_MS = 300;

export interface BufferedGameEvent extends MinecraftGameMessage {
  readonly seq: number;
}

interface Client {
  readonly id: number;
  readonly socket: WebSocket;
  /** The body of the first `PlayerMessage` is logged (verbose) to record the real shape. */
  loggedPlayerMessage: boolean;
}

interface PendingCommand {
  readonly client: Client;
  readonly resolve: (result: MinecraftCommandResult) => void;
  readonly reject: (error: Error) => void;
  readonly timer: NodeJS.Timeout;
}

interface QueuedCommand {
  readonly command: string;
  readonly requestId: string;
  readonly client: Client;
  readonly timeoutMs: number;
  readonly resolve: (result: MinecraftCommandResult) => void;
  readonly reject: (error: Error) => void;
}

type MessageHandler = (message: MinecraftGameMessage) => void;

export type ClientPolicy = 'newest' | 'oldest';

export interface HubOptions {
  /**
   * Which connection commands go to when no `clientId` is given.
   * @default 'newest'
   */
  clientPolicy?: ClientPolicy;
}

/** Same envelope for every frame the hub sends (`/connect` bridges send `commandRequest`). */
const header = (purpose: string, requestId: string) => ({
  requestId,
  messagePurpose: purpose,
  version: 1,
  messageType: 'commandRequest',
});

/**
 * Single WebSocket endpoint for the game (`/connect localhost:<port>`).
 * Handles many clients, command round-trips and event subscriptions.
 */
export class MinecraftHub {
  private readonly clientList = new Map<number, Client>();
  private readonly pending = new Map<string, PendingCommand>();
  private readonly queue: QueuedCommand[] = [];
  private readonly subscriptions = new Map<string, Set<MessageHandler>>();
  private readonly messageHandlers = new Set<MessageHandler>();
  private readonly events: BufferedGameEvent[] = [];
  private readonly reloadHandlers = new Set<(event: MinecraftReloadEvent) => void>();
  private readonly commandHandlers = new Set<(event: MinecraftCommandEvent) => void>();
  private readonly chatHandlers = new Set<(message: MinecraftChatMessage) => void>();
  private chatSubscription: (() => void) | undefined;
  private lastReloadEvent: MinecraftReloadEvent | undefined;
  private nextReloadSeq = 1;
  private nextClientId = 1;
  private nextEventSeq = 1;
  private reloadTimer: NodeJS.Timeout | undefined;
  private closed = false;

  private constructor(
    private readonly server: WebSocketServer,
    readonly clientPolicy: ClientPolicy,
  ) {
    server.on('connection', (socket) => this.attach(socket));
  }

  /** Starts listening; rejects with a readable error when the port is taken. */
  static listen(
    port: number,
    host = '127.0.0.1',
    options: HubOptions = {},
  ): Promise<MinecraftHub> {
    return new Promise((resolve, reject) => {
      const server = new WebSocketServer({ port, host });

      server.once('error', (error: NodeJS.ErrnoException) => {
        server.close();
        reject(
          error.code === 'EADDRINUSE'
            ? new Error(
                `Port ${port} is already in use. Stop the other process or set "server.port" in the profile config.`,
              )
            : error,
        );
      });
      server.once('listening', () => {
        server.on('error', (error) =>
          console.error('[ferolyte:ws] Server error:', error),
        );
        resolve(new MinecraftHub(server, options.clientPolicy ?? 'newest'));
      });
    });
  }

  get port(): number {
    const address = this.server.address();
    return typeof address === 'object' && address ? address.port : 0;
  }

  get clients(): readonly MinecraftConnection[] {
    return [...this.clientList.values()].map(({ id }) => ({ id }));
  }

  /** The connection commands go to by default (see `clientPolicy`), if any. */
  get primaryClientId(): number | undefined {
    return this.pickClient()?.id;
  }

  /** Result of the last reload of any client, or `null` when none happened yet. */
  get lastReload(): {
    seq: number;
    at: number;
    ok: boolean;
    trigger: MinecraftReloadTrigger;
  } | null {
    const event = this.lastReloadEvent;

    return event
      ? { seq: event.seq, at: event.at, ok: event.ok, trigger: event.trigger }
      : null;
  }

  get inFlight(): number {
    return this.pending.size;
  }

  get lastEventSeq(): number {
    return this.nextEventSeq - 1;
  }

  private attach(socket: WebSocket) {
    const client: Client = {
      id: this.nextClientId++,
      socket,
      loggedPlayerMessage: false,
    };
    this.clientList.set(client.id, client);

    // One listener per connection; responses are matched through `pending`.
    socket.on('message', (data) => this.handleMessage(client, data.toString()));
    socket.on('close', () => this.detach(client));
    socket.on('error', () => socket.terminate());

    for (const eventName of this.subscriptions.keys()) {
      this.sendSubscribe(client, eventName);
    }
  }

  private detach(client: Client) {
    this.clientList.delete(client.id);
    const error = new Error(`Client ${client.id} disconnected`);

    for (const [requestId, entry] of this.pending) {
      if (entry.client === client) {
        clearTimeout(entry.timer);
        this.pending.delete(requestId);
        entry.reject(error);
      }
    }

    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (this.queue[i].client === client) {
        this.queue.splice(i, 1)[0].reject(error);
      }
    }

    this.drain();
  }

  private handleMessage(client: Client, raw: string) {
    let parsed: {
      header?: {
        requestId?: string;
        messagePurpose?: string;
        eventName?: string;
      };
      body?: Record<string, unknown>;
    };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }

    const head = parsed.header;
    if (!head) {
      return;
    }

    const requestId = head.requestId;
    const entry = requestId ? this.pending.get(requestId) : undefined;
    if (entry && requestId) {
      clearTimeout(entry.timer);
      this.pending.delete(requestId);
      entry.resolve({
        status: Number(parsed.body?.statusCode ?? 0),
        message: String(parsed.body?.statusMessage ?? ''),
        body: parsed.body,
      });
      this.drain();
      return;
    }

    if (head.messagePurpose === 'commandResponse') {
      logger.verbose(
        `[ferolyte:ws] Unmatched commandResponse from client ${client.id} (requestId ${requestId ?? 'none'})`,
      );
      return;
    }

    if (head.eventName === 'PlayerMessage' && !client.loggedPlayerMessage) {
      client.loggedPlayerMessage = true;
      logger.verbose(
        `[ferolyte:ws] First PlayerMessage body from client ${client.id}: ${JSON.stringify(parsed.body)}`,
      );
    }

    const message: MinecraftGameMessage = {
      clientId: client.id,
      purpose: head.messagePurpose ?? '',
      eventName: head.eventName,
      body: parsed.body,
    };

    if (head.messagePurpose === 'event') {
      this.events.push({ ...message, seq: this.nextEventSeq++ });
      if (this.events.length > EVENT_BUFFER_SIZE) {
        this.events.shift();
      }
    }

    this.dispatch(this.messageHandlers, message);
    const handlers = head.eventName
      ? this.subscriptions.get(head.eventName)
      : undefined;
    if (handlers) {
      this.dispatch(handlers, message);
    }
  }

  private dispatch(
    handlers: Set<MessageHandler>,
    message: MinecraftGameMessage,
  ) {
    for (const handler of [...handlers]) {
      try {
        handler(message);
      } catch (error) {
        console.error('[ferolyte:ws] Message handler failed:', error);
      }
    }
  }

  private pickClient(): Client | undefined {
    const clients = [...this.clientList.values()];

    return this.clientPolicy === 'oldest' ? clients[0] : clients[clients.length - 1];
  }

  private resolveClient(clientId?: number): Client {
    const client =
      clientId === undefined ? this.pickClient() : this.clientList.get(clientId);

    if (!client) {
      throw new Error(
        clientId === undefined
          ? 'No Minecraft client connected. Use /connect localhost:<port> in game.'
          : `Client ${clientId} is not connected`,
      );
    }

    return client;
  }

  sendCommand(
    command: string,
    options: { clientId?: number; timeoutMs?: number } = {},
  ): Promise<MinecraftCommandResult> {
    if (this.closed) {
      return Promise.reject(new Error('Hub is closed'));
    }

    return new Promise((resolve, reject) => {
      try {
        const client = this.resolveClient(options.clientId);
        const requestId = randomUUID();
        const report = (outcome: Pick<MinecraftCommandEvent, 'result' | 'error'>) =>
          this.dispatchEvent(this.commandHandlers, {
            command,
            clientId: client.id,
            requestId,
            at: Date.now(),
            ...outcome,
          });

        this.queue.push({
          command,
          requestId,
          client,
          timeoutMs: options.timeoutMs ?? COMMAND_TIMEOUT_MS,
          resolve: (result) => {
            report({ result });
            resolve(result);
          },
          reject: (error) => {
            report({ error: error.message });
            reject(error);
          },
        });
      } catch (error) {
        reject(error as Error);
        return;
      }
      this.drain();
    });
  }

  scriptEvent(
    id: string,
    message = '',
    options: { clientId?: number } = {},
  ): Promise<MinecraftCommandResult> {
    return this.sendCommand(`scriptevent ${id} ${message}`.trimEnd(), options);
  }

  /** Sends queued commands while staying below the game's in-flight limit. */
  private drain() {
    while (this.queue.length > 0 && this.pending.size < MAX_IN_FLIGHT) {
      const next = this.queue.shift()!;
      const { requestId } = next;
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        next.reject(
          new Error(
            `Command timed out after ${next.timeoutMs} ms: ${next.command}`,
          ),
        );
        this.drain();
      }, next.timeoutMs);

      this.pending.set(requestId, {
        client: next.client,
        resolve: next.resolve,
        reject: next.reject,
        timer,
      });

      try {
        next.client.socket.send(
          JSON.stringify({
            header: header('commandRequest', requestId),
            body: {
              version: 1,
              commandLine: next.command,
              origin: { type: 'player' },
            },
          }),
        );
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(requestId);
        next.reject(error as Error);
      }
    }
  }

  private sendSubscribe(client: Client, eventName: string) {
    try {
      client.socket.send(
        JSON.stringify({
          header: header('subscribe', randomUUID()),
          body: { eventName },
        }),
      );
    } catch {
      // The client is closing; it is resubscribed when it reconnects.
    }
  }

  subscribe(eventName: string, handler?: MessageHandler): () => void {
    let handlers = this.subscriptions.get(eventName);
    if (!handlers) {
      handlers = new Set();
      this.subscriptions.set(eventName, handlers);
      for (const client of this.clientList.values()) {
        this.sendSubscribe(client, eventName);
      }
    }

    const set = handlers;
    if (handler) {
      set.add(handler);
    }

    return () => {
      if (handler) {
        set.delete(handler);
      }
    };
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /** Every command sent through the hub (also its own reload), once per command. */
  onCommand(handler: (event: MinecraftCommandEvent) => void): () => void {
    this.commandHandlers.add(handler);

    return () => {
      this.commandHandlers.delete(handler);
    };
  }

  /** Result of every reload, once per client. */
  onReload(handler: (event: MinecraftReloadEvent) => void): () => void {
    this.reloadHandlers.add(handler);

    return () => {
      this.reloadHandlers.delete(handler);
    };
  }

  /**
   * Normalised chat lines. Subscribes to `PlayerMessage` while there is a chat handler; the
   * subscription is shared with `subscribe()` and never dropped for other subscribers.
   */
  onChat(handler: (message: MinecraftChatMessage) => void): () => void {
    this.chatHandlers.add(handler);
    this.chatSubscription ??= this.subscribe('PlayerMessage', (message) => {
      const chat = normalizeChatBody(message.clientId, message.body);
      if (chat) {
        this.dispatchEvent(this.chatHandlers, chat);
      }
    });

    return () => {
      this.chatHandlers.delete(handler);
      if (this.chatHandlers.size === 0) {
        this.chatSubscription?.();
        this.chatSubscription = undefined;
      }
    };
  }

  /** Calls every handler; a throwing handler does not affect the others. */
  private dispatchEvent<T>(handlers: Set<(event: T) => void>, event: T) {
    for (const handler of [...handlers]) {
      try {
        handler(event);
      } catch (error) {
        console.error('[ferolyte:ws] Event handler failed:', error);
      }
    }
  }

  eventsSince(seq = 0): BufferedGameEvent[] {
    return this.events.filter((event) => event.seq > seq);
  }

  private emitReload(
    trigger: MinecraftReloadTrigger,
    clientId: number,
    ok: boolean,
    message: string,
  ) {
    const event: MinecraftReloadEvent = {
      trigger,
      clientId,
      ok,
      message,
      at: Date.now(),
      seq: this.nextReloadSeq++,
    };
    this.lastReloadEvent = event;
    this.dispatchEvent(this.reloadHandlers, event);
  }

  /**
   * Runs `/reload` on every connected client and reports the result in chat.
   * `onReload` handlers receive one event per client.
   */
  async reloadAll(trigger: MinecraftReloadTrigger = 'manual'): Promise<void> {
    await Promise.all(
      [...this.clientList.values()].map(async (client) => {
        try {
          const { status, message } = await this.sendCommand('reload', {
            clientId: client.id,
          }).catch((error: Error) => {
            this.emitReload(trigger, client.id, false, error.message);
            throw error;
          });
          this.emitReload(trigger, client.id, status === 0, message);
          const text =
            status === 0
              ? 'Scripts and functions reloaded.'
              : `Reload failed.\nError: ${message}`;
          (status === 0 ? console.log : console.error)(text);
          await this.sendCommand(
            'tellraw @a ' + JSON.stringify({ rawtext: [{ text }] }),
            { clientId: client.id },
          );
        } catch (error) {
          console.error(
            `[ferolyte:ws] Reload failed for client ${client.id}:`,
            (error as Error).message,
          );
        }
      }),
    );
  }

  /** Debounced reload for bursts of file changes. */
  scheduleReload(trigger: MinecraftReloadTrigger = 'packs') {
    clearTimeout(this.reloadTimer);
    this.reloadTimer = setTimeout(() => {
      this.reloadTimer = undefined;
      void this.reloadAll(trigger);
    }, RELOAD_DEBOUNCE_MS);
  }

  close(): Promise<void> {
    if (this.closed) {
      return Promise.resolve();
    }
    this.closed = true;
    clearTimeout(this.reloadTimer);

    const error = new Error('Hub is closed');
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(error);
    }
    this.pending.clear();
    for (const entry of this.queue.splice(0)) {
      entry.reject(error);
    }
    for (const client of this.clientList.values()) {
      client.socket.terminate();
    }
    this.clientList.clear();

    return new Promise((resolve) => this.server.close(() => resolve()));
  }
}
