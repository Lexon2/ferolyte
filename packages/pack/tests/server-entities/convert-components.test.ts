import { describe, expect, it, vi } from 'vitest';

import { ServerEntityBuilder } from '@artifex/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

describe('ServerEntityBuilder component conversion', () => {
  it('skips invalid registered components and logs diagnostics', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const entity = new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          dashAction: { direction: 'invalid' as never },
          shareables: { allItems: true },
        },
      }),
    )
      .withBuildContext({
        sourceFile: 'E:/project/entities/test.entity.ts',
        identifier: 'test:entity',
        contentType: 'server-entity',
      })
      .build();

    expect(entity['minecraft:entity'].components).toEqual({
      'minecraft:shareables': { all_items: true },
    });

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls.some((call) =>
      String(call[0]).includes('Server entity validation error'),
    )).toBe(true);
    expect(errorSpy.mock.calls.some((call) =>
      String(call[0]).includes('test.entity.ts'),
    )).toBe(true);
    expect(errorSpy.mock.calls.some((call) =>
      String(call[0]).includes('components.dashAction'),
    )).toBe(true);

    errorSpy.mockRestore();
  });

  it('logs unsupported component names', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          goalSelector: {},
        } as never,
      }),
    )
      .withBuildContext({
        sourceFile: 'E:/project/entities/test.entity.ts',
        contentType: 'server-entity',
      })
      .build();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toContain('goalSelector');

    errorSpy.mockRestore();
  });

  it('does not log when diagnostics is false', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          dashAction: { direction: 'invalid' as never },
        },
      }),
    )
      .withBuildContext({
        diagnostics: false,
        contentType: 'server-entity',
      })
      .build();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
