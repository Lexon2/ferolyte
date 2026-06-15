import { describe, it } from 'vitest';
import { createPlacementFilter } from '@ferolyte/pack/content/block/components/placement-filter';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createPlacementFilter', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createPlacementFilter);
  });

  it('returns undefined for invalid allowed face', () => {
    expectUndefined(createPlacementFilter, {
      conditions: [{ allowedFaces: ['invalid'] }],
    });
  });

  it('maps placement filter conditions', () => {
    expectComponent(
      createPlacementFilter,
      {
        conditions: [
          {
            allowedFaces: ['up'],
            blockFilter: [
              'minecraft:stone',
              { tags: 'query.any_tag("grass")' },
            ],
          },
        ],
      },
      'minecraft:placement_filter',
      {
        conditions: [
          {
            allowed_faces: ['up'],
            block_filter: [
              'minecraft:stone',
              { tags: 'query.any_tag("grass")' },
            ],
          },
        ],
      },
    );
  });
});
