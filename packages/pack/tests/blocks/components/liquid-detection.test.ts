import { describe, it } from 'vitest';
import { createLiquidDetection } from '@artifex/pack/content/block/components/liquid-detection';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createLiquidDetection', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createLiquidDetection);
  });

  it('returns undefined for invalid liquid type', () => {
    expectUndefined(createLiquidDetection, {
      detectionRules: [{ liquidType: 'lava' }],
    });
  });

  it('maps detection rules', () => {
    expectComponent(createLiquidDetection, {
      detectionRules: [{
        canContainLiquid: true,
        liquidType: 'water',
        onLiquidTouches: 'blocking',
        stopsLiquidFlowingFromDirection: ['up'],
        useLiquidClipping: true,
      }],
    }, 'minecraft:liquid_detection', {
      detection_rules: [{
        can_contain_liquid: true,
        liquid_type: 'water',
        on_liquid_touches: 'blocking',
        stops_liquid_flowing_from_direction: ['up'],
        use_liquid_clipping: true,
      }],
    });
  });
});
