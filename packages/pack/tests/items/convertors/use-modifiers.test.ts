import { describe, it } from 'vitest';
import { createUseModifiers } from '@ferolyte/pack/content/item/convertors/components/use-modifiers';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createUseModifiers', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createUseModifiers);
  });

  it('allows zero use duration', () => {
    expectComponent(
      createUseModifiers,
      { useDuration: 0 },
      'minecraft:use_modifiers',
      {
        use_duration: 0,
      },
    );
  });

  it('returns undefined for negative use duration', () => {
    expectUndefined(createUseModifiers, { useDuration: -1 });
  });

  it('maps all fields', () => {
    expectComponent(
      createUseModifiers,
      {
        useDuration: 32,
        movementModifier: 0.5,
        emitVibrations: true,
        startSound: 'random.burp',
      },
      'minecraft:use_modifiers',
      {
        use_duration: 32,
        movement_modifier: 0.5,
        emit_vibrations: true,
        start_sound: 'random.burp',
      },
    );
  });
});
