import { describe, it } from 'vitest';

import { convertTransportItemsBehavior } from '@ferolyte/pack/content/server-entity/convertors/behaviors/transport-items-behavior.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertTransportItemsBehavior', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertTransportItemsBehavior);
  });

  it('returns undefined for invalid search strategy', () => {
    expectUndefined(convertTransportItemsBehavior, {
      searchStrategy: 'invalid' as never,
    });
  });

  it('maps transport_items behavior', () => {
    expectComponent(
      convertTransportItemsBehavior,
      {
        priority: 4,
        sourceContainerTypes: ['chest'],
        destinationContainerTypes: ['hopper'],
        maxStackSize: 16,
        searchStrategy: 'nearest',
        placeStrategy: 'with_matching',
        allowedItems: ['minecraft:wheat'],
      },
      'minecraft:behavior.transport_items',
      {
        priority: 4,
        source_container_types: ['chest'],
        destination_container_types: ['hopper'],
        max_stack_size: 16,
        search_strategy: 'nearest',
        place_strategy: 'with_matching',
        allowed_items: ['minecraft:wheat'],
      },
    );
  });
});
