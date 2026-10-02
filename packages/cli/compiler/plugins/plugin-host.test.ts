import { describe, expect, it, vi } from 'vitest';

import { FerolytePluginApiVersion } from './api-version';
import {
  createWatchReadyEvent,
  initPlugins,
  stopPlugins,
} from './plugin-host';

vi.mock('../build-context', () => ({
  BUILD_CONTEXT: { PACKS: {} },
}));

const V = FerolytePluginApiVersion.V1_1_0;

describe('plugin-host stopPlugins', () => {
  it('calls beforeStop once, aborts the signal, and survives throwing plugins', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const good = vi.fn();
    const bad = vi.fn(() => {
      throw new Error('boom');
    });
    initPlugins(
      [
        { name: 'bad', apiVersion: V, beforeStop: bad },
        { name: 'good', apiVersion: V, beforeStop: good },
      ],
      'default',
    );
    const { signal } = createWatchReadyEvent();
    expect(signal.aborted).toBe(false);

    await stopPlugins('signal');
    await stopPlugins('error');

    expect(signal.aborted).toBe(true);
    expect(bad).toHaveBeenCalledTimes(1);
    expect(good).toHaveBeenCalledTimes(1);
    expect(good).toHaveBeenCalledWith({ profile: 'default', reason: 'signal' });
    spy.mockRestore();
  });
});
