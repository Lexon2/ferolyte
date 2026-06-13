import { describe, it } from 'vitest';
import { createDestructionParticles } from '@artifex/pack/content/block/components/destruction-particles';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createDestructionParticles', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createDestructionParticles);
  });

  it('returns undefined for invalid tint method', () => {
    expectUndefined(createDestructionParticles, { tintMethod: 'invalid' });
  });

  it('maps destruction particles fields', () => {
    expectComponent(createDestructionParticles, {
      texture: 'test_block',
      tintMethod: 'grass',
      particleCount: 16,
    }, 'minecraft:destruction_particles', {
      texture: 'test_block',
      tint_method: 'grass',
      particle_count: 16,
    });
  });
});
