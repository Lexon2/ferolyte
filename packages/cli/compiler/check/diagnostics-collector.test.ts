import {
  logContentError,
  logContentWarning,
  reportContentFailure,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { collectDiagnostics, formatDiagnostic } from './diagnostics-collector';

describe('collectDiagnostics', () => {
  let collector: ReturnType<typeof collectDiagnostics> | undefined;

  afterEach(() => {
    collector?.stop();
    collector = undefined;
    vi.restoreAllMocks();
  });

  it('collects structured records and silences console output', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    collector = collectDiagnostics({ silent: true });

    const ctx = {
      sourceFile: 'RP/item/a.item.ts',
      contentType: 'item' as const,
      component: 'minecraft:icon',
      fieldPath: 'texture',
    };
    logContentError(ctx, 'bad texture');
    logContentError(ctx, 'bad texture');
    logContentWarning(ctx, 'odd texture');
    reportContentFailure('BP/x.se.ts', 'Failed to bundle');

    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(collector.records).toEqual([
      {
        file: 'RP/item/a.item.ts',
        contentType: 'item',
        component: 'minecraft:icon',
        fieldPath: 'components.minecraft:icon.texture',
        message: 'bad texture',
        severity: 'error',
      },
      expect.objectContaining({ severity: 'warning', message: 'odd texture' }),
      expect.objectContaining({ file: 'BP/x.se.ts', severity: 'error' }),
    ]);
    expect(collector.errorCount()).toBe(2);
    expect(formatDiagnostic(collector.records[0])).toContain('bad texture');
  });

  it('prints to the console again after stop()', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    collector = collectDiagnostics({ silent: true });
    collector.stop();

    logContentError({ contentType: 'block' }, 'x');

    expect(error).toHaveBeenCalledTimes(1);
    expect(collector.records).toHaveLength(0);
  });
});
