import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { TransportItemsBehavior } from '../../interfaces/behaviors/transport-items-behavior';
import { convertRange } from '../common/convertors';
import {
  validateAllowedValues,
  validateBoolean,
  validateInteger,
  validateNumber,
  validateStringArray,
} from '../common/validation';

const SEARCH_STRATEGIES = ['nearest', 'random'] as const;
const PLACE_STRATEGIES = [
  'any',
  'with_matching',
  'with_matching_or_empty',
] as const;

/**
 * Converts a TransportItemsBehavior to Minecraft format
 * @param behavior The behavior to convert
 * @returns The behavior in Minecraft format or undefined if validation fails
 */
export const convertTransportItemsBehavior = (
  behavior: Partial<TransportItemsBehavior>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:behavior.transport_items': any } | undefined => {
  if (!behavior) {
    return undefined;
  }

  const result: any = {};

  if (behavior.priority !== undefined) {
    if (!validateNumber(behavior.priority, 'priority', 0, undefined, ctx)) {
      return undefined;
    }
    result.priority = behavior.priority;
  }

  if (behavior.sourceContainerTypes !== undefined) {
    if (!validateStringArray(behavior.sourceContainerTypes, 'sourceContainerTypes', ctx)) {
      return undefined;
    }
    result.source_container_types = behavior.sourceContainerTypes;
  }

  if (behavior.destinationContainerTypes !== undefined) {
    if (
      !validateStringArray(
        behavior.destinationContainerTypes,
        'destinationContainerTypes',
        ctx,
      )
    ) {
      return undefined;
    }
    result.destination_container_types = behavior.destinationContainerTypes;
  }

  if (behavior.maxStackSize !== undefined) {
    if (!validateInteger(behavior.maxStackSize, 'maxStackSize', 1, 64, ctx)) {
      return undefined;
    }
    result.max_stack_size = behavior.maxStackSize;
  }

  if (behavior.interactionTime !== undefined) {
    if (!validateNumber(behavior.interactionTime, 'interactionTime', 0, undefined, ctx)) {
      return undefined;
    }
    result.interaction_time = behavior.interactionTime;
  }

  if (behavior.allowSimultaneousInteraction !== undefined) {
    if (
      !validateBoolean(
        behavior.allowSimultaneousInteraction,
        'allowSimultaneousInteraction',
        ctx,
      )
    ) {
      return undefined;
    }
    result.allow_simultaneous_interaction = behavior.allowSimultaneousInteraction;
  }

  if (behavior.searchStrategy !== undefined) {
    if (
      !validateAllowedValues(
        behavior.searchStrategy,
        SEARCH_STRATEGIES,
        'searchStrategy',
        ctx,
      )
    ) {
      return undefined;
    }
    result.search_strategy = behavior.searchStrategy;
  }

  if (behavior.searchDistance !== undefined) {
    const convertedSearchDistance = convertRange(
      behavior.searchDistance,
      'searchDistance',
    );
    if (!convertedSearchDistance) {
      return undefined;
    }
    result.search_distance = convertedSearchDistance;
  }

  if (behavior.maxVisitedContainers !== undefined) {
    if (!validateInteger(behavior.maxVisitedContainers, 'maxVisitedContainers', 0, undefined, ctx)) {
      return undefined;
    }
    result.max_visited_containers = behavior.maxVisitedContainers;
  }

  if (behavior.initialCooldown !== undefined) {
    if (!validateInteger(behavior.initialCooldown, 'initialCooldown', 0, undefined, ctx)) {
      return undefined;
    }
    result.initial_cooldown = behavior.initialCooldown;
  }

  if (behavior.idleCooldown !== undefined) {
    if (!validateInteger(behavior.idleCooldown, 'idleCooldown', 0, undefined, ctx)) {
      return undefined;
    }
    result.idle_cooldown = behavior.idleCooldown;
  }

  if (behavior.placeStrategy !== undefined) {
    if (
      !validateAllowedValues(
        behavior.placeStrategy,
        PLACE_STRATEGIES,
        'placeStrategy',
        ctx,
      )
    ) {
      return undefined;
    }
    result.place_strategy = behavior.placeStrategy;
  }

  if (behavior.allowedItems !== undefined) {
    if (!validateStringArray(behavior.allowedItems, 'allowedItems', ctx)) {
      return undefined;
    }
    result.allowed_items = behavior.allowedItems;
  }

  if (behavior.disallowedItems !== undefined) {
    if (!validateStringArray(behavior.disallowedItems, 'disallowedItems', ctx)) {
      return undefined;
    }
    result.disallowed_items = behavior.disallowedItems;
  }

  return {
    'minecraft:behavior.transport_items': result,
  };
};
