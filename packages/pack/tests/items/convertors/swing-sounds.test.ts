import { describe, it } from 'vitest';
import { createSwingSounds } from '@artifex/pack/content/item/convertors/components/swing-sounds';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createSwingSounds', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createSwingSounds);
  });

  it('returns undefined for invalid sound type', () => {
    expectUndefined(createSwingSounds, { attackHit: 123 });
  });

  it('maps swing sounds', () => {
    expectComponent(createSwingSounds, {
      attackCriticalHit: 'crit',
      attackHit: 'hit',
      attackMiss: 'miss',
    }, 'minecraft:swing_sounds', {
      attack_critical_hit: 'crit',
      attack_hit: 'hit',
      attack_miss: 'miss',
    });
  });
});
