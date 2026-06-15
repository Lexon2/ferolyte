import { describe, it } from 'vitest';
import { createPrecipitationInteractions } from '@ferolyte/pack/content/block/components/precipitation-interactions';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createPrecipitationInteractions', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createPrecipitationInteractions);
  });

  it('returns undefined for invalid behavior', () => {
    expectUndefined(createPrecipitationInteractions, {
      precipitationBehavior: 'invalid',
    });
  });

  it('maps precipitation behavior', () => {
    expectComponent(
      createPrecipitationInteractions,
      {
        precipitationBehavior: 'obstruct_rain',
      },
      'minecraft:precipitation_interactions',
      {
        precipitation_behavior: 'obstruct_rain',
      },
    );
  });
});
