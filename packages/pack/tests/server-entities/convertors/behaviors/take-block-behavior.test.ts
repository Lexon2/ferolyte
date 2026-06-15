import { describe, it } from 'vitest';

import { convertTakeBlockBehavior } from '@ferolyte/pack/content/server-entity/convertors/behaviors/take-block-behavior.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertTakeBlockBehavior', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertTakeBlockBehavior);
  });

  it('returns undefined for invalid chance', () => {
    expectUndefined(convertTakeBlockBehavior, { chance: -1 });
  });

  it('maps take_block behavior', () => {
    expectComponent(
      convertTakeBlockBehavior,
      {
        priority: 2,
        blocks: ['minecraft:grass_block'],
        requiresLineOfSight: true,
        chance: 1,
      },
      'minecraft:behavior.take_block',
      {
        priority: 2,
        blocks: ['minecraft:grass_block'],
        requires_line_of_sight: true,
        chance: 1,
      },
    );
  });
});
