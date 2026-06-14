import { describe, expect, it, vi } from 'vitest';

import { ServerEntityBuilder } from '@artifex/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

describe('ServerEntityBuilder diagnostics', () => {
  it('logs formatted error for invalid damageSensor.dealsDamage', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          damageSensor: {
            triggers: [
              {
                cause: 'all',
                dealsDamage: 'invalid' as never,
              },
            ],
          },
        },
      }),
    )
      .withBuildContext({
        sourceFile: 'E:/project/entities/test.se.ts',
        identifier: 'test:entity',
        contentType: 'server-entity',
      })
      .build();

    const output = errorSpy.mock.calls.map((call) => String(call[0])).join('\n');

    expect(output).toContain('Server entity validation error');
    expect(output).toContain('test.se.ts');
    expect(output).toContain('components.damageSensor.triggers[0].dealsDamage');
    expect(output).toContain('dealsDamage must be one of:');

    errorSpy.mockRestore();
  });

  it('logs source file and filter path for unknown filter test in behavior', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    new ServerEntityBuilder(
      minimalServerEntityConfig({
        components: {
          behaviors: {
            nearestPrioritizedAttackableTarget: {
              priority: 2,
              entityTypes: [
                {
                  priority: 0,
                  filters: {
                    allOf: [
                      {
                        test: 'unknown_test' as never,
                        subject: 'other',
                        value: 'player',
                      },
                    ],
                  },
                  maxDist: 70,
                },
              ],
            },
          },
        },
      }),
    )
      .withBuildContext({
        sourceFile: 'E:/project/entities/test.se.ts',
        identifier: 'test:entity',
        contentType: 'server-entity',
      })
      .build();

    const output = errorSpy.mock.calls.map((call) => String(call[0])).join('\n');

    expect(output).toContain('Server entity validation error');
    expect(output).toContain('test.se.ts');
    expect(output).toContain(
      'components.behaviors.nearestPrioritizedAttackableTarget.entityTypes[0].filters.allOf[0].test',
    );
    expect(output).toContain('Unknown filter test: unknown_test');

    errorSpy.mockRestore();
  });
});
