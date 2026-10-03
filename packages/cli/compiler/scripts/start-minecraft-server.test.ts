import { afterEach, describe, expect, it, vi } from 'vitest';

import { BUILD_CONTEXT } from '../build-context';
import { FerolytePluginApiVersion } from '../plugins/api-version';
import {
  createAfterLoadEvent,
  createWatchReadyEvent,
  emitHook,
  initPlugins,
} from '../plugins/plugin-host';
import type { FerolytePlugin } from '../plugins/types';
import { startMinecraftServer } from './start-minecraft-server';

const V12 = FerolytePluginApiVersion.V1_2_0;
const disposers: Array<() => Promise<void>> = [];

afterEach(async () => {
  await Promise.all(disposers.splice(0).map((dispose) => dispose()));
  BUILD_CONTEXT.SERVER.HTTP = false;
  BUILD_CONTEXT.SERVER.PORT = 8080;
  BUILD_CONTEXT.SERVER.CLIENT_POLICY = 'newest';
  BUILD_CONTEXT.SERVER.RELOAD_ON_PACK_CHANGE = false;
  vi.restoreAllMocks();
});

describe('plugin context of the game hub (API 1.2.0)', () => {
  it('exposes onReload / onCommand / onChat / primaryClientId and the effective server config', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    BUILD_CONTEXT.SERVER.PORT = 0;
    BUILD_CONTEXT.SERVER.HTTP = { port: 0, host: '127.0.0.1' };
    BUILD_CONTEXT.SERVER.CLIENT_POLICY = 'oldest';
    BUILD_CONTEXT.SERVER.RELOAD_ON_PACK_CHANGE = true;
    initPlugins([], 'default');
    disposers.push(await startMinecraftServer());

    for (const event of [createWatchReadyEvent(), createAfterLoadEvent({ content: [], copy: [] })]) {
      expect(typeof event.minecraft?.onReload).toBe('function');
      expect(typeof event.minecraft?.onCommand).toBe('function');
      expect(typeof event.minecraft?.onChat).toBe('function');
      expect(event.minecraft?.primaryClientId).toBeUndefined();
      expect(event.server).toMatchObject({
        reloadOnPackChange: true,
        clientPolicy: 'oldest',
        http: { host: '127.0.0.1' },
      });
      expect(event.server?.port).toBeGreaterThan(0);
      expect((event.server?.http as { port: number }).port).toBeGreaterThan(0);
    }
  });

  it('reports http: false when the HTTP API is disabled', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    BUILD_CONTEXT.SERVER.PORT = 0;
    BUILD_CONTEXT.SERVER.HTTP = false;
    initPlugins([], 'default');
    disposers.push(await startMinecraftServer());

    expect(createWatchReadyEvent().server?.http).toBe(false);
    expect(createWatchReadyEvent().minecraft?.http).toBeUndefined();
  });

  it('has no minecraft context and no server config outside watch (run / check / inspect)', () => {
    initPlugins([], 'default');

    const event = createAfterLoadEvent({ content: [], copy: [] });

    expect(event.minecraft).toBeUndefined();
    expect(event.server).toBeUndefined();
    expect(createWatchReadyEvent().server).toBeUndefined();
  });

  it('accepts API 1.2.0 and 1.1.0 plugins and isolates afterScriptBuild errors', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const received = vi.fn();
    const plugins: FerolytePlugin[] = [
      { name: 'old', apiVersion: FerolytePluginApiVersion.V1_1_0 },
      {
        name: 'bad',
        apiVersion: V12,
        afterScriptBuild() {
          throw new Error('boom');
        },
      },
      { name: 'good', apiVersion: V12, afterScriptBuild: received },
    ];
    initPlugins(plugins, 'dev');

    await emitHook('afterScriptBuild', { profile: 'dev', ok: false });

    expect(received).toHaveBeenCalledWith({ profile: 'dev', ok: false });
    expect(error).toHaveBeenCalled();
    expect(() =>
      initPlugins([{ name: 'future', apiVersion: '9.9.9' as never }], 'dev'),
    ).toThrow(/1\.2\.0/);
  });
});
