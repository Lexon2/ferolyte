import { LiquidDetectionComponent } from '../interfaces/block-config';

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

/**
 * Creates a liquid_detection component for Minecraft blocks
 * @param options The liquid detection options
 * @returns The liquid_detection component in Minecraft format or undefined if validation fails
 */
export const createLiquidDetection = (
  options?: LiquidDetectionComponent,
): { 'minecraft:liquid_detection': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.detectionRules)) {
    const rules: any[] = [];

    for (const rule of options.detectionRules) {
      const newRule: any = {};

      if (rule.canContainLiquid !== undefined) {
        if (typeof rule.canContainLiquid !== 'boolean') {
          // @TODO: Add error handling
          console.error('Can contain liquid must be a boolean');

          return undefined;
        }
        newRule.can_contain_liquid = rule.canContainLiquid;
      }

      if (rule.liquidType !== undefined) {
        if (rule.liquidType !== 'water') {
          // @TODO: Add error handling
          console.error('Liquid type must be "water"');

          return undefined;
        }
        newRule.liquid_type = rule.liquidType;
      }

      if (rule.onLiquidTouches !== undefined) {
        const validValues: OnLiquidTouches[] = [
          'blocking',
          'broken',
          'popped',
          'no_reaction',
        ];
        if (!validValues.includes(rule.onLiquidTouches)) {
          // @TODO: Add error handling
          console.error(
            'On liquid touches must be "blocking", "broken", "popped", or "no_reaction"',
          );

          return undefined;
        }
        newRule.on_liquid_touches = rule.onLiquidTouches;
      }

      if (Array.isArray(rule.stopsLiquidFlowingFromDirection)) {
        const validDirections: Direction[] = [
          'up',
          'down',
          'north',
          'south',
          'east',
          'west',
          'side',
          'all',
        ];

        for (const direction of rule.stopsLiquidFlowingFromDirection) {
          if (!validDirections.includes(direction)) {
            // @TODO: Add error handling
            console.error(
              'Stops liquid flowing from direction must be valid directions',
            );

            return undefined;
          }
        }

        newRule.stops_liquid_flowing_from_direction =
          rule.stopsLiquidFlowingFromDirection;
      }

      if (rule.useLiquidClipping !== undefined) {
        if (typeof rule.useLiquidClipping !== 'boolean') {
          console.error('Use liquid clipping must be a boolean');

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
