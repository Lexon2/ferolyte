import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { PickupItemsBehavior } from '../../interfaces/behaviors/pickup-items-behavior';
import { validateNumber, validateBoolean, validateStringArray, validateInteger } from '../common/validation';

/**
 * Converts a PickupItemsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertPickupItemsBehavior = (
  behavior: Partial<PickupItemsBehavior>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:behavior.pickup_items': any } | undefined => {
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

  // Validate canPickupAnyItem
  if (behavior.canPickupAnyItem !== undefined) {
    if (!validateBoolean(behavior.canPickupAnyItem, 'canPickupAnyItem')) {
      return undefined;
    }
    result.can_pickup_any_item = behavior.canPickupAnyItem;
  }

  // Validate canPickupToHandOrEquipment
  if (behavior.canPickupToHandOrEquipment !== undefined) {
    if (!validateBoolean(behavior.canPickupToHandOrEquipment, 'canPickupToHandOrEquipment')) {
      return undefined;
    }
    result.can_pickup_to_hand_or_equipment = behavior.canPickupToHandOrEquipment;
  }

  // Validate cooldownAfterBeingAttacked
  if (behavior.cooldownAfterBeingAttacked !== undefined) {
    if (!validateNumber(behavior.cooldownAfterBeingAttacked, 'cooldownAfterBeingAttacked')) {
      return undefined;
    }
    result.cooldown_after_being_attacked = behavior.cooldownAfterBeingAttacked;
  }

  // Validate excludedItems
  if (behavior.excludedItems !== undefined) {
    if (!validateStringArray(behavior.excludedItems, 'excludedItems')) {
      return undefined;
    }
    result.excluded_items = behavior.excludedItems;
  }

  // Validate goalRadius
  if (behavior.goalRadius !== undefined) {
    if (!validateNumber(behavior.goalRadius, 'goalRadius')) {
      return undefined;
    }
    result.goal_radius = behavior.goalRadius;
  }

  // Validate maxDist
  if (behavior.maxDist !== undefined) {
    if (!validateNumber(behavior.maxDist, 'maxDist')) {
      return undefined;
    }
    result.max_dist = behavior.maxDist;
  }

  // Validate searchHeight
  if (behavior.searchHeight !== undefined) {
    if (!validateInteger(behavior.searchHeight, 'searchHeight')) {
      return undefined;
    }
    result.search_height = behavior.searchHeight;
  }

  // Validate pickupBasedOnChance
  if (behavior.pickupBasedOnChance !== undefined) {
    if (!validateBoolean(behavior.pickupBasedOnChance, 'pickupBasedOnChance')) {
      return undefined;
    }
    result.pickup_based_on_chance = behavior.pickupBasedOnChance;
  }

  // Validate pickupSameItemsAsInHand
  if (behavior.pickupSameItemsAsInHand !== undefined) {
    if (!validateBoolean(behavior.pickupSameItemsAsInHand, 'pickupSameItemsAsInHand')) {
      return undefined;
    }
    result.pickup_same_items_as_in_hand = behavior.pickupSameItemsAsInHand;
  }

  // Validate trackTarget
  if (behavior.trackTarget !== undefined) {
    if (!validateBoolean(behavior.trackTarget, 'trackTarget')) {
      return undefined;
    }
    result.track_target = behavior.trackTarget;
  }

  return {
    'minecraft:behavior.pickup_items': result
  };
};
