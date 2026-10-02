import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocket } from 'ws';

import { MinecraftHttpApi } from './minecraft-http';
import { MAX_IN_FLIGHT, MinecraftHub } from './minecraft-hub';

type Frame = { header: Record<string, string>; body: Record<string, any> };

const openClients: WebSocket[] = [];
const hubs: MinecraftHub[] = [];

/** Fake game client: records frames, answers commands via `respond`. */
const connect = async (
  hub: MinecraftHub,
  respond: (frame: Frame, socket: WebSocket) => void = (frame, socket) =>
    socket.send(
      JSON.stringify({
        header: {
          requestId: frame.header.requestId,
          messagePurpose: 'commandResponse',
        },
        body: { statusCode: 0, statusMessage: 'ok' },
      }),
    ),
) => {
  const socket = new WebSocket(`ws://127.0.0.1:${hub.port}`);
  const frames: Frame[] = [];
  socket.on('message', (data) => {
    const frame = JSON.parse(data.toString()) as Frame;
    frames.push(frame);
    if (frame.header.messagePurpose === 'commandRequest') {
      respond(frame, socket);
    }
  });
  openClients.push(socket);
  await new Promise((resolve) => socket.once('open', resolve));
  await vi.waitFor(() => expect(hub.clients.length).toBeGreaterThan(0));
  return { socket, frames };
};

const startHub = async () => {
  const hub = await MinecraftHub.listen(0);
  hubs.push(hub);
  return hub;
};

afterEach(async () => {
  for (const socket of openClients.splice(0)) {
    socket.terminate();
  }
  await Promise.all(hubs.splice(0).map((hub) => hub.close()));
});

describe('MinecraftHub', () => {
  it('round-trips a command', async () => {
    const hub = await startHub();
    const { frames } = await connect(hub);

    await expect(hub.sendCommand('say hi')).resolves.toEqual({
      status: 0,
      message: 'ok',
    });
    expect(frames[0].body.commandLine).toBe('say hi');
  });

  it('times out and does not leak pending requests or listeners', async () => {
    const hub = await startHub();
    const { socket } = await connect(hub, () => {});

    await expect(hub.sendCommand('slow', { timeoutMs: 30 })).rejects.toThrow(
      /timed out/,
    );
    expect(hub.inFlight).toBe(0);

    for (let i = 0; i < 5; i++) {
      await hub.sendCommand('slow', { timeoutMs: 5 }).catch(() => {});
    }
    void socket;
    const serverSockets = (hub as any).server.clients as Set<WebSocket>;
    for (const serverSocket of serverSockets) {
      expect(serverSocket.listenerCount('message')).toBe(1);
    }
  });

  it('reloads every connected client', async () => {
    const hub = await startHub();
    const a = await connect(hub);
    const b = await connect(hub);
    await vi.waitFor(() => expect(hub.clients.length).toBe(2));
    vi.spyOn(console, 'log').mockImplementation(() => {});

    await hub.reloadAll();

    for (const { frames } of [a, b]) {
      expect(frames.some((f) => f.body.commandLine === 'reload')).toBe(true);
    }
    vi.restoreAllMocks();
  });

  it('queues commands above the in-flight cap', async () => {
    const hub = await startHub();
    const held: Array<() => void> = [];
    const { frames } = await connect(hub, (frame, socket) => {
      held.push(() =>
        socket.send(
          JSON.stringify({
            header: {
              requestId: frame.header.requestId,
              messagePurpose: 'commandResponse',
            },
            body: { statusCode: 0, statusMessage: 'ok' },
          }),
        ),
      );
    });

    const results = Array.from({ length: MAX_IN_FLIGHT + 5 }, (_, i) =>
      hub.sendCommand(`c${i}`),
    );
    await vi.waitFor(() => expect(frames.length).toBe(MAX_IN_FLIGHT));
    expect(hub.inFlight).toBe(MAX_IN_FLIGHT);

    held.splice(0).forEach((answer) => answer());
    await vi.waitFor(() => expect(frames.length).toBe(MAX_IN_FLIGHT + 5));
    held.splice(0).forEach((answer) => answer());
    await Promise.all(results);
  });

  it('subscribes, buffers events and resubscribes after reconnect', async () => {
    const hub = await startHub();
    const handler = vi.fn();
    const first = await connect(hub);
    hub.subscribe('PlayerMessage', handler);
    await vi.waitFor(() =>
      expect(first.frames.some((f) => f.body.eventName === 'PlayerMessage')).toBe(
        true,
      ),
    );

    first.socket.send(
      JSON.stringify({
        header: { messagePurpose: 'event', eventName: 'PlayerMessage' },
        body: { message: 'hello' },
      }),
    );
    await vi.waitFor(() => expect(handler).toHaveBeenCalledTimes(1));
    expect(hub.eventsSince(0)).toHaveLength(1);
    expect(hub.eventsSince(hub.lastEventSeq)).toHaveLength(0);

    first.socket.close();
    await vi.waitFor(() => expect(hub.clients.length).toBe(0));
    const second = await connect(hub);
    await vi.waitFor(() =>
      expect(
        second.frames.some((f) => f.body.eventName === 'PlayerMessage'),
      ).toBe(true),
    );
  });

  it('rejects clearly when the port is in use', async () => {
    const hub = await startHub();
    await expect(MinecraftHub.listen(hub.port)).rejects.toThrow(
      /already in use/,
    );
  });

  it('fails commands when no client is connected', async () => {
    const hub = await startHub();
    await expect(hub.sendCommand('say hi')).rejects.toThrow(/No Minecraft/);
  });
});

describe('MinecraftHttpApi', () => {
  it('serves status, commands and plugin routes', async () => {
    const hub = await startHub();
    await connect(hub);
    const api = new MinecraftHttpApi(hub);
    api.route('GET', '/custom', () => ({ status: 201, body: { ok: true } }));
    await api.listen(0);
    const base = `http://127.0.0.1:${api.port}`;

    try {
      const status = (await (await fetch(`${base}/status`)).json()) as {
        clients: unknown[];
      };
      expect(status.clients).toHaveLength(1);

      const command = await fetch(`${base}/command`, {
        method: 'POST',
        body: JSON.stringify({ command: 'say hi' }),
      });
      expect(await command.json()).toEqual({ status: 0, message: 'ok' });

      const custom = await fetch(`${base}/custom`);
      expect(custom.status).toBe(201);
      expect((await fetch(`${base}/missing`)).status).toBe(404);
      expect(
        (await fetch(`${base}/command`, { method: 'POST', body: '{}' })).status,
      ).toBe(400);
    } finally {
      await api.close();
    }
  });
});
