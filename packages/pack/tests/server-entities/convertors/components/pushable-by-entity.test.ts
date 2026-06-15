import { describe, it } from 'vitest';

import { convertPushableByEntityComponent } from '@ferolyte/pack/content/server-entity/convertors/components/physical/pushable-by-entity-component.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertPushableByEntityComponent', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertPushableByEntityComponent);
  });

  it('returns undefined when value is false', () => {
    expectUndefined(convertPushableByEntityComponent, { value: false });
  });

  it('maps marker component', () => {
    expectComponent(
      convertPushableByEntityComponent,
      {},
      'minecraft:pushable_by_entity',
      {},
    );
  });
});
