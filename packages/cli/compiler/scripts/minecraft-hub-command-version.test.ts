import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocket } from 'ws';

import { DEFAULT_COMMAND_VERSION, MinecraftHub } from './minecraft-hub';

type Frame = { header: Record<string, any>; body: Record<string, any> };

const sockets: WebSocket[] = [];
const hubs: MinecraftHub[] = [];

const startHub = async (options: { commandVersion?: number } = {}) => {
  const hub = await MinecraftHub.listen(0, '127.0.0.1', options);
  hubs.push(hub);
  const socket = new WebSocket(`ws://127.0.0.1:${hub.port}`);
  const frames: Frame[] = [];
  socket.on('message', (data) => {
    const frame = JSON.parse(data.toString()) as Frame;
    frames.push(frame);
    if (frame.header.messagePurpose === 'commandRequest') {
      socket.send(
        JSON.stringify({
          header: { requestId: frame.header.requestId, messagePurpose: 'commandResponse' },
          body: { statusCode: 0, statusMessage: 'ok' },
        }),
      );
    }
  });
  sockets.push(socket);
  await new Promise((resolve) => socket.once('open', resolve));
  await vi.waitFor(() => expect(hub.clients.length).toBeGreaterThan(0));

  return { hub, frames };
};

afterEach(async () => {
  sockets.splice(0).forEach((socket) => socket.terminate());
  await Promise.all(hubs.splice(0).map((hub) => hub.close()));
});

describe('hub command version', () => {
  it('sends the current command syntax version by default, the frame header stays 1', async () => {
    const { hub, frames } = await startHub();

    await hub.sendCommand('execute as @p run say t1');

    expect(frames[0].body.version).toBe(DEFAULT_COMMAND_VERSION);
    expect(DEFAULT_COMMAND_VERSION).not.toBe(1);
    expect(frames[0].body.commandLine).toBe('execute as @p run say t1');
    expect(frames[0].header.version).toBe(1);
  });

  it('sends the configured version (1 = legacy syntax)', async () => {
    const { hub, frames } = await startHub({ commandVersion: 1 });

    await hub.sendCommand('execute @p ~ ~ ~ say t3');

    expect(frames[0].body.version).toBe(1);
    expect(hub.commandVersion).toBe(1);
  });

  it('its own commands are plain under both syntaxes', async () => {
    for (const commandVersion of [1, DEFAULT_COMMAND_VERSION]) {
      const { hub, frames } = await startHub({ commandVersion });
      await hub.reloadAll();
      await hub.scriptEvent('ns:ping', 'x');

      const lines = frames
        .filter((f) => f.header.messagePurpose === 'commandRequest')
        .map((f) => f.body.commandLine as string);
      expect(lines[0]).toBe('reload');
      expect(lines[1]).toMatch(/^tellraw @a \{"rawtext":/);
      expect(lines[2]).toBe('scriptevent ns:ping x');
      for (const f of frames.filter((f) => f.header.messagePurpose === 'commandRequest')) {
        expect(f.body.version).toBe(commandVersion);
      }
    }
  });
});
