import { describe, it } from 'vitest';
import { createUseAnimation } from '@ferolyte/pack/content/item/convertors/components/use-animation';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createUseAnimation', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createUseAnimation);
  });

  it('returns undefined for invalid animation', () => {
    expectUndefined(createUseAnimation, 'invalid');
  });

  it('maps valid animation', () => {
    expectComponent(
      createUseAnimation,
      'eat',
      'minecraft:use_animation',
      'eat',
    );
  });
});
