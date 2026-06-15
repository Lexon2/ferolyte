import { describe, it } from 'vitest';

import { convertIsWeatherFilter } from '@ferolyte/pack/content/server-entity/convertors/filters/is-weather-filter';

import { expectFilter, expectUndefined } from '../../helpers/assert-component';

describe('convertIsWeatherFilter', () => {
  it('returns undefined when value is missing', () => {
    expectUndefined(convertIsWeatherFilter, {});
  });

  it('returns undefined for invalid weather type', () => {
    expectUndefined(convertIsWeatherFilter, { value: 'rain' as never });
  });

  it('maps is_weather filter value', () => {
    expectFilter(
      convertIsWeatherFilter,
      {
        value: 'clear',
      },
      {
        value: 'clear',
      },
    );
  });
});
