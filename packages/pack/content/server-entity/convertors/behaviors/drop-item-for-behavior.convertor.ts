import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { DropItemForBehavior } from '../../interfaces/behaviors/drop-item-for-behavior';
import { convertRange } from '../common/convertors';
import { convertSingleEntityDefinition } from '../common/entity-definition.convertor';
import { convertTrigger } from '../common/trigger.convertor';
import {
  validateNumber,
  validateTradeOrLootTablePath,
  validateVector3,
} from '../common/validation';

/**
 * Converts a DropItemForBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertDropItemForBehavior = (
  behavior: Partial<DropItemForBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.drop_item_for': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  // Validate priority
  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority')) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  // Validate entityTypes
  if (behavior.entityTypes !== undefined) {
    const convertedEntityTypes = Array.isArray(behavior.entityTypes)
      ? behavior.entityTypes.map((entityType) =>
          convertSingleEntityDefinition(entityType),
        )
      : convertSingleEntityDefinition(behavior.entityTypes);

    if (
      convertedEntityTypes === undefined ||
      (Array.isArray(convertedEntityTypes) &&
        convertedEntityTypes.some((type) => type === undefined))
    ) {
      return undefined;
    }
    result.entity_types = convertedEntityTypes;
  }

  // Validate cooldown
  if (behavior.cooldown !== undefined) {
    if (!validateNumber(behavior.cooldown, 'cooldown')) {
      return undefined;
    }
    result.cooldown = behavior.cooldown;
  }

  // Validate dropItemChance
  if (behavior.dropItemChance !== undefined) {
    if (!validateNumber(behavior.dropItemChance, 'dropItemChance')) {
      return undefined;
    }
    result.drop_item_chance = behavior.dropItemChance;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate lootTable
  if (behavior.lootTable !== undefined) {
    if (!validateTradeOrLootTablePath(behavior.lootTable, 'lootTable')) {
      return undefined;
    }
    result.loot_table = behavior.lootTable;
  }

  // Validate maxHeadLookAtHeight
  if (behavior.maxHeadLookAtHeight !== undefined) {
    if (!validateNumber(behavior.maxHeadLookAtHeight, 'maxHeadLookAtHeight')) {
      return undefined;
    }
    result.max_head_look_at_height = behavior.maxHeadLookAtHeight;
  }

  // Validate minimumTeleportDistance
  if (behavior.minimumTeleportDistance !== undefined) {
    if (
      !validateNumber(
        behavior.minimumTeleportDistance,
        'minimumTeleportDistance',
      )
    ) {
      return undefined;
    }
    result.minimum_teleport_distance = behavior.minimumTeleportDistance;
  }

  // Validate offeringDistance
  if (behavior.offeringDistance !== undefined) {
    if (!validateNumber(behavior.offeringDistance, 'offeringDistance')) {
      return undefined;
    }
    result.offering_distance = behavior.offeringDistance;
  }

  // Validate onDropAttempt
  if (behavior.onDropAttempt !== undefined) {
    const onDropAttempt = convertTrigger(
      behavior.onDropAttempt,
      withFieldPath(ctx, 'onDropAttempt'),
    );
    if (!onDropAttempt) {
      return undefined;
    }
    result.on_drop_attempt = onDropAttempt;
  }

  // Validate searchCount
  if (behavior.searchCount !== undefined) {
    if (!validateNumber(behavior.searchCount, 'searchCount')) {
      return undefined;
    }
    result.search_count = behavior.searchCount;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateNumber(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate searchRange
  if (behavior.searchRange !== undefined) {
    if (!validateNumber(behavior.searchRange, 'searchRange')) {
      return undefined;
    }
    result.search_range = behavior.searchRange;
  }

  // Validate secondsBeforePickup
  if (behavior.secondsBeforePickup !== undefined) {
    if (!validateNumber(behavior.secondsBeforePickup, 'secondsBeforePickup')) {
      return undefined;
    }
    result.seconds_before_pickup = behavior.secondsBeforePickup;
  }

  // Validate targetRange
  if (behavior.targetRange !== undefined) {
    if (!validateVector3(behavior.targetRange, 'targetRange')) {
      return undefined;
    }
    result.target_range = behavior.targetRange;
  }

  // Validate teleportOffset
  if (behavior.teleportOffset !== undefined) {
    if (!validateVector3(behavior.teleportOffset, 'teleportOffset')) {
      return undefined;
    }
    result.teleport_offset = behavior.teleportOffset;
  }

  // Validate timeOfDayRange
  if (behavior.timeOfDayRange !== undefined) {
    const convertedTimeOfDayRange = convertRange(
      behavior.timeOfDayRange,
      'timeOfDayRange',
      0,
      1,
    );
    if (!convertedTimeOfDayRange) {
      return undefined;
    }
    result.time_of_day_range = convertedTimeOfDayRange;
  }

  return {
    'minecraft:behavior.drop_item_for': result,
  };
};
