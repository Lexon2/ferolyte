import { describe, it } from 'vitest';

import { convertRotationAxisAlignedComponent } from '@ferolyte/pack/content/server-entity/convertors/components/physical/rotation-axis-aligned-component.convertor';

import {
  expectComponent,
  expectUndefined,
} from '../../helpers/assert-component';

describe('convertRotationAxisAlignedComponent', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(convertRotationAxisAlignedComponent);
  });

  it('returns undefined when value is false', () => {
    expectUndefined(convertRotationAxisAlignedComponent, { value: false });
  });

  it('maps marker component', () => {
    expectComponent(
      convertRotationAxisAlignedComponent,
      {},
      'minecraft:rotation_axis_aligned',
      {},
    );
  });
});
