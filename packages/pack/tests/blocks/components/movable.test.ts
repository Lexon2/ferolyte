import { describe, it } from 'vitest';
import { createMovable } from '@ferolyte/pack/content/block/components/movable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createMovable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createMovable);
  });

  it('returns undefined for invalid movement type', () => {
    expectUndefined(createMovable, { movementType: 'invalid' });
  });

  it('maps movable fields', () => {
    expectComponent(
      createMovable,
      { movementType: 'push_pull', sticky: 'same' },
      'minecraft:movable',
      {
        movement_type: 'push_pull',
        sticky: 'same',
      },
    );
  });
});
