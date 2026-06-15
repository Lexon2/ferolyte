import { describe, it } from 'vitest';

import { convertPlaceBlockBehavior } from '@ferolyte/pack/content/server-entity/convertors/behaviors/place-block-behavior.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertPlaceBlockBehavior', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertPlaceBlockBehavior);
  });

  it('returns undefined for invalid chance', () => {
    expectUndefined(convertPlaceBlockBehavior, { chance: -1 });
  });

  it('maps place_block behavior', () => {
    expectComponent(
      convertPlaceBlockBehavior,
      {
        priority: 1,
        affectedByGriefingRule: true,
        chance: 0.5,
        placeableCarriedBlocks: ['minecraft:dirt'],
        xzRange: [1, 3],
        yRange: [0, 1],
      },
      'minecraft:behavior.place_block',
      {
        priority: 1,
        affected_by_griefing_rule: true,
        chance: 0.5,
        placeable_carried_blocks: ['minecraft:dirt'],
        xz_range: [1, 3],
        y_range: [0, 1],
      },
    );
  });
});
