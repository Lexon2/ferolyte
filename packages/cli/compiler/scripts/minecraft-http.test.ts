import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebSocket } from 'ws';

import { httpResponse } from '../plugins/http-response';
import { logger } from '../utils/logger';
import { MinecraftHttpApi } from './minecraft-http';
import { MinecraftHub } from './minecraft-hub';

const sockets: WebSocket[] = [];
const closers: Array<() => Promise<void>> = [];

const setup = async (connectClient = true) => {
  const hub = await MinecraftHub.listen(0);
  closers.push(() => hub.close());
  if (connectClient) {
    const socket = new WebSocket(`ws://127.0.0.1:${hub.port}`);
    socket.on('message', (data) => {
      const frame = JSON.parse(data.toString());
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
    await vi.waitFor(() => expect(hub.clients).toHaveLength(1));
  }
  const api = new MinecraftHttpApi(hub);
  closers.push(() => api.close());

  return { hub, api, start: async () => { await api.listen(0); return `http://127.0.0.1:${api.port}`; } };
};

afterEach(async () => {
  for (const socket of sockets.splice(0)) {
    socket.terminate();
  }
  await Promise.all(closers.splice(0).map((close) => close()));
  logger.setLevel('normal');
  vi.restoreAllMocks();
});

describe('route overrides and prefix routes (item 2)', () => {
  it('replaces a built-in route and logs the override once per path', async () => {
    logger.setLevel('verbose');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { api, start } = await setup();
    api.route('GET', '/status', () => ({ custom: true }));
    api.route('GET', '/status', () => ({ custom: 2 }));
    const base = await start();

    expect(await (await fetch(`${base}/status`)).json()).toEqual({ custom: 2 });
    const lines = log.mock.calls.filter(([m]) => String(m).includes('route GET /status overridden by plugin'));
    expect(lines).toHaveLength(1);
  });

  it('matches prefix routes with the full path; an exact route wins', async () => {
    const { api, start } = await setup();
    api.route('GET', '/api/*', ({ path }) => ({ prefix: path }));
    api.route('GET', '/api/special', () => ({ exact: true }));
    api.route('GET', '/api/deep/*', ({ path }) => ({ deep: path }));
    const base = await start();

    expect(await (await fetch(`${base}/api/anything/here`)).json()).toEqual({ prefix: '/api/anything/here' });
    expect(await (await fetch(`${base}/api/special`)).json()).toEqual({ exact: true });
    expect(await (await fetch(`${base}/api/deep/x`)).json()).toEqual({ deep: '/api/deep/x' });
    expect((await fetch(`${base}/other`)).status).toBe(404);
  });
});

describe('request headers and abort signal (item 2)', () => {
  it('passes lower-cased headers', async () => {
    const { api, start } = await setup();
    api.route('GET', '/h', ({ headers }) => headers);
    const base = await start();

    const headers = (await (await fetch(`${base}/h`, { headers: { 'X-Custom-Header': 'Value' } })).json()) as Record<string, string>;

    expect(headers['x-custom-header']).toBe('Value');
    expect(Object.keys(headers).every((name) => name === name.toLowerCase())).toBe(true);
  });

  it('aborts the signal when the client disconnects before the response', async () => {
    const { api, start } = await setup();
    let observed: Promise<boolean> | undefined;
    api.route('GET', '/wait', ({ signal }) => {
      observed = new Promise<boolean>((resolve) => {
        signal.addEventListener('abort', () => resolve(true));
        setTimeout(() => resolve(false), 2000);
      });

      return observed;
    });
    const base = await start();
    const controller = new AbortController();

    const request = fetch(`${base}/wait`, { signal: controller.signal }).catch(() => undefined);
    await vi.waitFor(() => expect(observed).toBeDefined());
    controller.abort();
    await request;

    await expect(observed).resolves.toBe(true);
  });

  it('does not abort the signal after a normal response', async () => {
    const { api, start } = await setup();
    let signal: AbortSignal | undefined;
    api.route('GET', '/ok', (request) => {
      signal = request.signal;

      return { fine: true };
    });
    const base = await start();

    await (await fetch(`${base}/ok`)).json();
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(signal?.aborted).toBe(false);
  });
});

describe('response envelope (item 2)', () => {
  it('httpResponse() sets the status; a plain { status: "ok" } payload is a 200 body', async () => {
    const { api, start } = await setup();
    api.route('GET', '/missing', () => httpResponse(404, { error: 'nope' }));
    api.route('GET', '/plain', () => ({ status: 'ok' }));
    api.route('GET', '/legacy', () => ({ status: 202, body: { legacy: true } }));
    api.route('GET', '/empty', () => httpResponse(204));
    const base = await start();

    const missing = await fetch(`${base}/missing`);
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({ error: 'nope' });

    const plain = await fetch(`${base}/plain`);
    expect(plain.status).toBe(200);
    expect(await plain.json()).toEqual({ status: 'ok' });

    const legacy = await fetch(`${base}/legacy`);
    expect(legacy.status).toBe(202);
    expect(await legacy.json()).toEqual({ legacy: true });

    expect((await fetch(`${base}/empty`)).status).toBe(204);
  });

  it('recognises the marker of another copy of httpResponse (Symbol.for)', async () => {
    const { api, start } = await setup();
    api.route('GET', '/copy', () => ({ [Symbol.for('ferolyte.httpResponse')]: true, status: 418, body: 'tea' }));
    const base = await start();

    expect((await fetch(`${base}/copy`)).status).toBe(418);
  });
});

describe('built-in routes (item 1, 2)', () => {
  it('/status reports connected and lastReload', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const { hub, start } = await setup();
    const base = await start();

    const before = (await (await fetch(`${base}/status`)).json()) as any;
    expect(before).toMatchObject({ connected: true, lastReload: null });

    await hub.reloadAll('scripts');
    const after = (await (await fetch(`${base}/status`)).json()) as any;
    expect(after.lastReload).toMatchObject({ trigger: 'scripts', ok: true });
    const first = after.lastReload.seq;

    await hub.reloadAll('packs');
    const again = (await (await fetch(`${base}/status`)).json()) as any;
    expect(again.lastReload.seq).toBeGreaterThan(first);
    expect(again.lastReload.trigger).toBe('packs');
  });

  it('/status connected is false without clients', async () => {
    const { start } = await setup(false);
    const base = await start();

    expect(((await (await fetch(`${base}/status`)).json()) as any).connected).toBe(false);
  });

  it('/subscribe accepts event as an alias of eventName', async () => {
    const { hub, start } = await setup();
    const base = await start();

    const response = await fetch(`${base}/subscribe`, { method: 'POST', body: JSON.stringify({ event: 'PlayerMessage' }) });

    expect(response.status).toBe(200);
    expect((hub as any).subscriptions.has('PlayerMessage')).toBe(true);
    expect(
      (await fetch(`${base}/subscribe`, { method: 'POST', body: '{}' })).status,
    ).toBe(400);
  });

  it('/events honours limit (the last N of the since window)', async () => {
    const { hub, start } = await setup();
    const base = await start();
    const socket = sockets[0];
    void socket;
    for (let i = 1; i <= 5; i++) {
      (hub as any).events.push({ clientId: 1, purpose: 'event', eventName: 'X', body: i, seq: (hub as any).nextEventSeq++ });
    }

    const all = (await (await fetch(`${base}/events?since=0`)).json()) as any;
    const limited = (await (await fetch(`${base}/events?since=1&limit=2`)).json()) as any;

    expect(all.events).toHaveLength(5);
    expect(limited.events.map((e: any) => e.body)).toEqual([4, 5]);
    expect(limited.last).toBe(5);
  });
});
