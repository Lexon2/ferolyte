import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocket } from 'ws';

import type {
  MinecraftChatMessage,
  MinecraftCommandEvent,
  MinecraftReloadEvent,
} from '../plugins/types';
import { logger } from '../utils/logger';
import { MinecraftHub } from './minecraft-hub';

type Frame = { header: Record<string, any>; body: Record<string, any> };

const sockets: WebSocket[] = [];
const hubs: MinecraftHub[] = [];

const ok = (frame: Frame, socket: WebSocket) =>
  socket.send(
    JSON.stringify({
      header: { requestId: frame.header.requestId, messagePurpose: 'commandResponse' },
      body: { statusCode: 0, statusMessage: 'ok' },
    }),
  );

/** Fake game client; `respond` answers `commandRequest` frames. */
const connect = async (
  hub: MinecraftHub,
  respond: (frame: Frame, socket: WebSocket) => void = ok,
) => {
  const before = hub.clients.length;
  const socket = new WebSocket(`ws://127.0.0.1:${hub.port}`);
  const frames: Frame[] = [];
  socket.on('message', (data) => {
    const frame = JSON.parse(data.toString()) as Frame;
    frames.push(frame);
    if (frame.header.messagePurpose === 'commandRequest') {
      respond(frame, socket);
    }
  });
  sockets.push(socket);
  await new Promise((resolve) => socket.once('open', resolve));
  await vi.waitFor(() => expect(hub.clients.length).toBe(before + 1));

  return { socket, frames, id: hub.clients[hub.clients.length - 1].id };
};

const startHub = async (clientPolicy?: 'newest' | 'oldest') => {
  const hub = await MinecraftHub.listen(0, '127.0.0.1', { clientPolicy });
  hubs.push(hub);

  return hub;
};

afterEach(async () => {
  for (const socket of sockets.splice(0)) {
    socket.terminate();
  }
  await Promise.all(hubs.splice(0).map((hub) => hub.close()));
  logger.setLevel('normal');
  vi.restoreAllMocks();
});

describe('protocol frames (item 3)', () => {
  it('sends messageType commandRequest on commands and subscriptions and keeps origin', async () => {
    const hub = await startHub();
    const { frames } = await connect(hub);
    hub.subscribe('PlayerMessage');
    await hub.sendCommand('say hi');

    await vi.waitFor(() => expect(frames.length).toBeGreaterThanOrEqual(2));
    for (const frame of frames) {
      expect(frame.header.messageType).toBe('commandRequest');
      expect(frame.header.version).toBe(1);
    }
    const command = frames.find((f) => f.header.messagePurpose === 'commandRequest');
    expect(command?.body.origin).toEqual({ type: 'player' });
    expect(frames.some((f) => f.header.messagePurpose === 'subscribe')).toBe(true);
  });

  it('logs the raw body of the first PlayerMessage per connection (verbose) and unmatched responses', async () => {
    logger.setLevel('verbose');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const hub = await startHub();
    const { socket } = await connect(hub);
    const event = (message: string) =>
      socket.send(
        JSON.stringify({
          header: { messagePurpose: 'event', eventName: 'PlayerMessage' },
          body: { message, sender: 'Steve', type: 'chat' },
        }),
      );

    event('one');
    event('two');
    socket.send(
      JSON.stringify({
        header: { requestId: 'nope', messagePurpose: 'commandResponse' },
        body: {},
      }),
    );
    await vi.waitFor(() => expect(hub.lastEventSeq).toBe(2));
    await vi.waitFor(() =>
      expect(log.mock.calls.some(([m]) => String(m).includes('Unmatched commandResponse'))).toBe(true),
    );

    const first = log.mock.calls.filter(([m]) => String(m).includes('First PlayerMessage body'));
    expect(first).toHaveLength(1);
    expect(String(first[0][0])).toContain('"message":"one"');
  });
});

describe('reload events (item 1)', () => {
  it('emits one event per client with increasing seq, trigger and ok', async () => {
    const hub = await startHub();
    await connect(hub);
    await connect(hub);
    const events: MinecraftReloadEvent[] = [];
    hub.onReload((event) => events.push(event));

    await hub.reloadAll('scripts');

    expect(events).toHaveLength(2);
    expect(events.map((e) => e.trigger)).toEqual(['scripts', 'scripts']);
    expect(events.every((e) => e.ok && e.message === 'ok')).toBe(true);
    expect(events[1].seq).toBeGreaterThan(events[0].seq);
    expect(new Set(events.map((e) => e.clientId)).size).toBe(2);
    expect(hub.lastReload).toMatchObject({ seq: events[1].seq, ok: true, trigger: 'scripts' });
  });

  it('reports ok false for a failing reload and for a timeout, and defaults the trigger', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const hub = await startHub();
    await connect(hub, (frame, socket) =>
      socket.send(
        JSON.stringify({
          header: { requestId: frame.header.requestId, messagePurpose: 'commandResponse' },
          body: { statusCode: -1, statusMessage: 'reload failed' },
        }),
      ),
    );
    const events: MinecraftReloadEvent[] = [];
    hub.onReload((event) => events.push(event));

    await hub.reloadAll();

    expect(events[0]).toMatchObject({ trigger: 'manual', ok: false, message: 'reload failed' });
  });

  it('unsubscribes and isolates throwing handlers', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const hub = await startHub();
    await connect(hub);
    const good = vi.fn();
    const stop = hub.onReload(good);
    hub.onReload(() => {
      throw new Error('boom');
    });

    await hub.reloadAll('packs');
    expect(good).toHaveBeenCalledTimes(1);

    stop();
    await hub.reloadAll('packs');
    expect(good).toHaveBeenCalledTimes(1);
  });

  it('scheduleReload uses the packs trigger', async () => {
    const hub = await startHub();
    await connect(hub);
    const events: MinecraftReloadEvent[] = [];
    hub.onReload((event) => events.push(event));

    hub.scheduleReload();
    await vi.waitFor(() => expect(events).toHaveLength(1));

    expect(events[0].trigger).toBe('packs');
  });
});

describe('client policy (item 4)', () => {
  const target = (frames: Frame[]) =>
    frames.filter((f) => f.body.commandLine === 'say x').length;

  it('newest (default): a newer connection gets the commands, then the older one', async () => {
    const hub = await startHub();
    const first = await connect(hub);
    const second = await connect(hub);

    expect(hub.primaryClientId).toBe(second.id);
    await hub.sendCommand('say x');
    expect(target(second.frames)).toBe(1);
    expect(target(first.frames)).toBe(0);

    second.socket.close();
    await vi.waitFor(() => expect(hub.clients).toHaveLength(1));
    expect(hub.primaryClientId).toBe(first.id);
    await hub.sendCommand('say x');
    expect(target(first.frames)).toBe(1);
  });

  it('oldest keeps the previous behaviour and an explicit clientId always wins', async () => {
    const hub = await startHub('oldest');
    const first = await connect(hub);
    const second = await connect(hub);

    expect(hub.primaryClientId).toBe(first.id);
    await hub.sendCommand('say x');
    await hub.sendCommand('say x', { clientId: second.id });
    expect(target(first.frames)).toBe(1);
    expect(target(second.frames)).toBe(1);
  });
});

describe('command tap and body (item 5)', () => {
  it('reports every command including the internal reload, once, with result or error', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const hub = await startHub();
    const { id } = await connect(hub, (frame, socket) => {
      if (frame.body.commandLine === 'fail') {
        return;
      }
      ok(frame, socket);
    });
    const events: MinecraftCommandEvent[] = [];
    hub.onCommand((event) => events.push(event));

    const result = await hub.sendCommand('say hi');
    await hub.reloadAll('manual');
    await expect(hub.sendCommand('fail', { timeoutMs: 20 })).rejects.toThrow(/timed out/);

    expect(result.body).toEqual({ statusCode: 0, statusMessage: 'ok' });
    const commands = events.map((e) => e.command);
    expect(commands.slice(0, 2)).toEqual(['say hi', 'reload']);
    expect(commands.some((c) => c.startsWith('tellraw'))).toBe(true);
    expect(events[0]).toMatchObject({ clientId: id, result: { status: 0, message: 'ok' } });
    expect(typeof events[0].requestId).toBe('string');
    expect(events[0].error).toBeUndefined();
    const failed = events.find((e) => e.command === 'fail');
    expect(failed?.error).toMatch(/timed out/);
    expect(failed?.result).toBeUndefined();
    expect(commands.filter((c) => c === 'say hi')).toHaveLength(1);
  });
});

describe('chat helper (item 7)', () => {
  const emit = (socket: WebSocket, body: unknown) =>
    socket.send(
      JSON.stringify({
        header: { messagePurpose: 'event', eventName: 'PlayerMessage' },
        body,
      }),
    );

  it('subscribes on demand and delivers both body shapes with flattened text', async () => {
    const hub = await startHub();
    const { socket, frames } = await connect(hub);
    const lines: MinecraftChatMessage[] = [];
    hub.onChat((message) => lines.push(message));

    await vi.waitFor(() =>
      expect(frames.some((f) => f.header.messagePurpose === 'subscribe' && f.body.eventName === 'PlayerMessage')).toBe(true),
    );

    emit(socket, { message: '§cred §rplain', sender: 'Steve', type: 'chat' });
    emit(socket, {
      properties: {
        Message: JSON.stringify({ rawtext: [{ text: 'a ' }, { translate: 'k.%s', with: ['b'] }, { selector: '@s' }] }),
        Sender: 'Alex',
        MessageType: 'say',
      },
    });
    await vi.waitFor(() => expect(lines).toHaveLength(2));

    expect(lines[0]).toMatchObject({ sender: 'Steve', type: 'chat', text: 'red plain' });
    expect(lines[1]).toMatchObject({ sender: 'Alex', type: 'say', text: 'a k.b@s' });
  });

  it('keeps a plain subscribe alive when the last chat handler unsubscribes', async () => {
    const hub = await startHub();
    const { socket } = await connect(hub);
    const seen = vi.fn();
    hub.subscribe('PlayerMessage', seen);
    const stop = hub.onChat(() => {});

    stop();
    emit(socket, { message: 'hi', sender: 'Steve', type: 'chat' });

    await vi.waitFor(() => expect(seen).toHaveBeenCalledTimes(1));
    expect((hub as any).chatSubscription).toBeUndefined();
  });
});
