import { describe, expect, it, vi } from 'vitest';

import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { minimalServerEntityConfig } from './helpers/fixtures';

describe('nested entity events', () => {
  it('converts sequence → randomize → sequence → first_valid', () => {
    const result = new ServerEntityBuilder(
      minimalServerEntityConfig({
        events: {
          test: {
            sequence: [
              {
                randomize: [
                  {
                    weight: 1,
                    sequence: [
                      {
                        firstValid: [
                          {
                            filters: {
                              allOf: [
                                {
                                  test: 'is_family',
                                  subject: 'other',
                                  value: 'player',
                                },
                              ],
                            },
                            trigger: 'deep',
                            emitParticle: { particle: 'minecraft:heart' },
                            emitVibration: { vibration: 'entity_act' },
                            resetTarget: true,
                            setHomePosition: true,
                            playSound: { sound: 'pop' },
                            stopMovement: {
                              stopVerticalMovement: true,
                              stopHorizontalMovement: false,
                            },
                            executeEventOnHomeBlock: { event: 'home' },
                            setProperty: { 'a:b': 'query.life_time' },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      }),
    ).build();

    const event: any = result['minecraft:entity'].events?.test;
    const leaf = event.sequence[0].randomize[0].sequence[0].first_valid[0];
    expect(event.sequence[0].randomize[0].weight).toBe(1);
    expect(leaf).toMatchObject({
      trigger: 'deep',
      emit_particle: { particle: 'minecraft:heart' },
      emit_vibration: { vibration: 'entity_act' },
      reset_target: true,
      set_home_position: {},
      play_sound: { sound: 'pop' },
      stop_movement: {
        stop_vertical_movement: true,
        stop_horizontal_movement: false,
      },
      execute_event_on_home_block: { event: 'home' },
      set_property: { 'a:b': 'query.life_time' },
    });
    expect(leaf.filters.all_of).toHaveLength(1);
  });

  it('reports nested diagnostics path', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    new ServerEntityBuilder(
      minimalServerEntityConfig({
        events: {
          x: {
            sequence: [
              {
                randomize: [{}, { sequence: [{ trigger: 123 as never }] }],
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

    const output = errorSpy.mock.calls.map((c) => String(c[0])).join('\n');
    expect(output).toContain('events.x.sequence[0].randomize[1].sequence[0]');

    errorSpy.mockRestore();
  });
});
