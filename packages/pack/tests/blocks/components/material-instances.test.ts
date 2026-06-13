import { describe, it } from 'vitest';
import { createMaterialInstances } from '@artifex/pack/content/block/components/material-instances';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createMaterialInstances', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createMaterialInstances);
  });

  it('returns undefined for empty texture string', () => {
    expectUndefined(createMaterialInstances, { up: '' });
  });

  it('maps string and object face materials', () => {
    expectComponent(createMaterialInstances, {
      up: 'texture_up',
      down: { texture: 'texture_down', renderMethod: 'opaque', faceDimming: true },
    }, 'minecraft:material_instances', {
      up: 'texture_up',
      down: { texture: 'texture_down', render_method: 'opaque', face_dimming: true },
    });
  });
});
