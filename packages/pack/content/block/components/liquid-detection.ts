import { LiquidDetectionComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
} from '@artifex/common/content/validation/content-validation';

type Direction =
  | 'up'
  | 'down'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'side'
  | 'all';
type OnLiquidTouches = 'blocking' | 'broken' | 'popped' | 'no_reaction';

const VALID_LIQUID_TYPES = ['water'] as const;
const VALID_ON_LIQUID_TOUCHES: OnLiquidTouches[] = [
  'blocking',
  'broken',
  'popped',
  'no_reaction',
];
const VALID_DIRECTIONS: Direction[] = [
  'up',
  'down',
  'north',
  'south',
  'east',
  'west',
  'side',
  'all',
];

/**
 * Creates a liquid_detection component for Minecraft blocks
 */
export const createLiquidDetection = (
  options?: LiquidDetectionComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:liquid_detection': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.detectionRules)) {
    const rules: any[] = [];

    for (let index = 0; index < options.detectionRules.length; index++) {
      const rule = options.detectionRules[index];
      const ruleContext =
        ctx !== undefined
          ? { ...ctx, fieldPath: `detectionRules[${index}]` }
          : undefined;
      const newRule: any = {};

      if (rule.canContainLiquid !== undefined) {
        if (
          !validateBooleanValue(
            rule.canContainLiquid,
            ruleContext,
            'Can contain liquid must be a boolean',
            'canContainLiquid',
          )
        ) {
          return undefined;
        }
        newRule.can_contain_liquid = rule.canContainLiquid;
      }

      if (rule.liquidType !== undefined) {
        if (
          !validateAllowedValue(
            rule.liquidType,
            VALID_LIQUID_TYPES,
            ruleContext,
            'Liquid type must be "water"',
            'liquidType',
          )
        ) {
          return undefined;
        }
        newRule.liquid_type = rule.liquidType;
      }

      if (rule.onLiquidTouches !== undefined) {
        if (
          !validateAllowedValue(
            rule.onLiquidTouches,
            VALID_ON_LIQUID_TOUCHES,
            ruleContext,
            'On liquid touches must be "blocking", "broken", "popped", or "no_reaction"',
            'onLiquidTouches',
          )
        ) {
          return undefined;
        }
        newRule.on_liquid_touches = rule.onLiquidTouches;
      }

      if (Array.isArray(rule.stopsLiquidFlowingFromDirection)) {
        for (let dirIndex = 0; dirIndex < rule.stopsLiquidFlowingFromDirection.length; dirIndex++) {
          const direction = rule.stopsLiquidFlowingFromDirection[dirIndex];
          if (
            !validateAllowedValue(
              direction,
              VALID_DIRECTIONS,
              ruleContext,
              'Stops liquid flowing from direction must be valid directions',
              `stopsLiquidFlowingFromDirection[${dirIndex}]`,
            )
          ) {
            return undefined;
          }
        }

        newRule.stops_liquid_flowing_from_direction =
          rule.stopsLiquidFlowingFromDirection;
      }

      if (rule.useLiquidClipping !== undefined) {
        if (
          !validateBooleanValue(
            rule.useLiquidClipping,
            ruleContext,
            'Use liquid clipping must be a boolean',
            'useLiquidClipping',
          )
        ) {
          return undefined;
        }
        newRule.use_liquid_clipping = rule.useLiquidClipping;
      }

      rules.push(newRule);
    }

    result.detection_rules = rules;
  }

  return {
    'minecraft:liquid_detection': result,
  };
};
