import { describe, it } from 'vitest';

import { convertPushableByBlockComponent } from '@artifex/pack/content/server-entity/convertors/components/physical/pushable-by-block-component.convertor';

import { expectComponent, expectUndefined } from '../../helpers/assert-component';

describe('convertPushableByBlockComponent', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertPushableByBlockComponent);
  });

  it('returns undefined when value is false', () => {
    expectUndefined(convertPushableByBlockComponent, { value: false });
  });

  it('maps marker component', () => {
    expectComponent(
      convertPushableByBlockComponent,
      {},
      'minecraft:pushable_by_block',
      {},
    );
  });
});
