import { afterEach, describe, expect, it, vi } from 'vitest';
import { convertBlockTraits } from '@ferolyte/pack/content/block/traits/convert-traits';

const silence = () => ({
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
});

describe('connection / sixteen way / multiBlock traits', () => {
  afterEach(() => vi.restoreAllMocks());

  it('maps sixteen way rotation', () => {
    expect(
      convertBlockTraits({
        placementDirection: { states: ['minecraft:sixteen_way_rotation'] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    ).toEqual({
      'minecraft:placement_direction': {
        enabled_states: ['minecraft:sixteen_way_rotation'],
        y_rotation_offset: undefined,
      },
    });
  });

  it('maps connection trait', () => {
    expect(convertBlockTraits({ connection: {} })).toEqual({
      'minecraft:connection': {
        enabled_states: ['minecraft:cardinal_connections'],
      },
    });
  });

  it('maps multi block direction, parts and default states', () => {
    expect(
      convertBlockTraits({ multiBlock: { direction: 'up', parts: 2 } }),
    ).toEqual({
      'minecraft:multi_block': {
        enabled_states: ['minecraft:multi_block_part'],
        direction: 'up',
        parts: 2,
      },
    });
  });

  it('rejects invalid direction and parts', () => {
    const { error } = silence();
    expect(
      convertBlockTraits({ multiBlock: { direction: 'left' as never } }),
    ).toEqual({});
    expect(
      convertBlockTraits({
        multiBlock: { direction: 'up', parts: 5 as never },
      }),
    ).toEqual({});
    expect(error).toHaveBeenCalledTimes(2);
  });

  it('rejects combination with connection and placementPosition', () => {
    const { error } = silence();
    const multiBlock = { direction: 'up' as const };
    expect(
      convertBlockTraits({ multiBlock, connection: {} })[
        'minecraft:multi_block'
      ],
    ).toBeUndefined();
    expect(
      convertBlockTraits({
        multiBlock,
        placementPosition: { states: ['minecraft:block_face'] },
      })['minecraft:multi_block'],
    ).toBeUndefined();
    expect(error).toHaveBeenCalledTimes(2);
  });

  it('allows only cardinal_direction with placementDirection', () => {
    silence();
    const multiBlock = { direction: 'up' as const };
    expect(
      convertBlockTraits({
        multiBlock,
        placementDirection: { states: ['minecraft:cardinal_direction'] },
      })['minecraft:multi_block'],
    ).toBeDefined();
    expect(
      convertBlockTraits({
        multiBlock,
        placementDirection: { states: ['minecraft:facing_direction'] },
      })['minecraft:multi_block'],
    ).toBeUndefined();
  });

  it('rejects geometry with nWayVisualRotation', () => {
    silence();
    expect(
      convertBlockTraits({ multiBlock: { direction: 'up' } }, undefined, {
        geometry: { identifier: 'geometry.x', nWayVisualRotation: { y: 's' } },
      })['minecraft:multi_block'],
    ).toBeUndefined();
  });

  it('allows blockEntity together with a multi block', () => {
    const error = silence().error;
    expect(
      convertBlockTraits({ multiBlock: { direction: 'up' } }, undefined, {
        blockEntity: {},
      })['minecraft:multi_block'],
    ).toBeDefined();
    expect(error).not.toHaveBeenCalled();
  });

  it('rejects horizontal direction with randomOffset', () => {
    const { error } = silence();
    expect(
      convertBlockTraits(
        { multiBlock: { direction: 'east' } },
        undefined,
        { randomOffset: { x: { steps: 2 } } },
        '1.26.50',
      )['minecraft:multi_block'],
    ).toBeUndefined();
    expect(error).toHaveBeenCalledOnce();
  });

  it('does not warn for horizontal directions from format_version 1.26.50', () => {
    const { warn } = silence();
    expect(
      convertBlockTraits(
        { multiBlock: { direction: 'south' } },
        undefined,
        undefined,
        '1.26.50',
      )['minecraft:multi_block'],
    ).toBeDefined();
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns for horizontal directions', () => {
    const { warn } = silence();
    expect(
      convertBlockTraits({ multiBlock: { direction: 'north' } })[
        'minecraft:multi_block'
      ],
    ).toBeDefined();
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('Upcoming Creator Features');
  });
});
