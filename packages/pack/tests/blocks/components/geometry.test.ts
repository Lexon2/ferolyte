import { describe, it } from 'vitest';
import { createGeometry } from '@artifex/pack/content/block/components/geometry';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createGeometry', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createGeometry);
  });

  it('returns undefined for empty string', () => {
    expectUndefined(createGeometry, '');
  });

  it('maps string identifier', () => {
    expectComponent(createGeometry, 'geometry.test.block', 'minecraft:geometry', 'geometry.test.block');
  });

  it('maps geometry object', () => {
    expectComponent(createGeometry, {
      identifier: 'geometry.test.block',
      boneVisibility: { root: true },
      uvLock: true,
    }, 'minecraft:geometry', {
      identifier: 'geometry.test.block',
      bone_visibility: { root: true },
      uv_lock: true,
    });
  });
});
