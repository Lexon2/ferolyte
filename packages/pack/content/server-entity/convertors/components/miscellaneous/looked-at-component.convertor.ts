import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { LookedAtComponent } from '../../../interfaces/components/miscellaneous/looked-at-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber } from '../../common/validation';

/**
 * Validates a look at location
 * @param location The location to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the location is valid
 */
const validateLookAtLocation = (
  location: any,
  fieldName: string,
): boolean => {
  if (!location) {
    return false;
  }

  // Validate location
  if (!location.location || !['head', 'body', 'feet'].includes(location.location)) {
    console.error(`${fieldName}.location must be one of: head, body, feet`);

    return false;
  }

  // Validate verticalOffset if present
  if (location.verticalOffset !== undefined) {
    if (!validateNumber(location.verticalOffset, `${fieldName}.verticalOffset`, -Number.MAX_VALUE, Number.MAX_VALUE)) {
      return false;
    }
  }

  return true;
};

/**
 * Converts a LookedAtComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertLookedAtComponent = (
  component: Partial<LookedAtComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:looked_at': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate fieldOfView
  if (component.fieldOfView !== undefined) {
    if (!validateNumber(component.fieldOfView, 'fieldOfView', 0, 360)) {
      return undefined;
    }
    result.field_of_view = component.fieldOfView;
  }

  // Validate filters
  if (component.filters !== undefined) {
    const convertedFilters = convertEntityFilters(component.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate findPlayersOnly
  if (component.findPlayersOnly !== undefined) {
    if (typeof component.findPlayersOnly !== 'boolean') {
      console.error('findPlayersOnly must be a boolean');

      return undefined;
    }
    result.find_players_only = component.findPlayersOnly;
  }

  // Validate lineOfSightObstructionType
  if (component.lineOfSightObstructionType !== undefined) {
    if (!['outline', 'collision', 'collision_for_camera'].includes(component.lineOfSightObstructionType)) {
      console.error('lineOfSightObstructionType must be one of: outline, collision, collision_for_camera');

      return undefined;
    }
    result.line_of_sight_obstruction_type = component.lineOfSightObstructionType;
  }

  // Validate lookAtLocations
  if (component.lookAtLocations !== undefined) {
    if (!Array.isArray(component.lookAtLocations) || component.lookAtLocations.length === 0) {
      console.error('lookAtLocations must be a non-empty array');

      return undefined;
    }

    const validatedLocations = component.lookAtLocations.map((location, index) => {
      if (!validateLookAtLocation(location, `lookAtLocations[${index}]`)) {
        return undefined;
      }

      const validatedLocation: any = {
        location: location.location,
      };

      if (location.verticalOffset !== undefined) {
        validatedLocation.vertical_offset = location.verticalOffset;
      }

      return validatedLocation;
    });

    if (validatedLocations.includes(undefined)) {
      return undefined;
    }

    result.look_at_locations = validatedLocations;
  }

  // Validate lookedAtCooldown
  if (component.lookedAtCooldown !== undefined) {
    if (!Array.isArray(component.lookedAtCooldown) || component.lookedAtCooldown.length !== 2) {
      console.error('lookedAtCooldown must be an array of two numbers');

      return undefined;
    }

    if (!validateNumber(component.lookedAtCooldown[0], 'lookedAtCooldown[0]', 0, Number.MAX_VALUE) ||
        !validateNumber(component.lookedAtCooldown[1], 'lookedAtCooldown[1]', 0, Number.MAX_VALUE)) {
      return undefined;
    }

    result.looked_at_cooldown = component.lookedAtCooldown;
  }

  // Validate lookedAtEvent
  if (component.lookedAtEvent !== undefined) {
    const convertedLookedAtEvent = convertTrigger(component.lookedAtEvent, withFieldPath(ctx, 'lookedAtEvent'));
    if (!convertedLookedAtEvent) {
      return undefined;
    }
    result.looked_at_event = convertedLookedAtEvent;
  }

  // Validate notLookedAtEvent
  if (component.notLookedAtEvent !== undefined) {
    const convertedNotLookedAtEvent = convertTrigger(component.notLookedAtEvent, withFieldPath(ctx, 'notLookedAtEvent'));
    if (!convertedNotLookedAtEvent) {
      return undefined;
    }
    result.not_looked_at_event = convertedNotLookedAtEvent;
  }

  // Validate scaleFovByDistance
  if (component.scaleFovByDistance !== undefined) {
    if (typeof component.scaleFovByDistance !== 'boolean') {
      console.error('scaleFovByDistance must be a boolean');

      return undefined;
    }
    result.scale_fov_by_distance = component.scaleFovByDistance;
  }

  // Validate searchRadius
  if (component.searchRadius !== undefined) {
    if (!validateNumber(component.searchRadius, 'searchRadius', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.search_radius = component.searchRadius;
  }

  // Validate minLookedAtDuration
  if (component.minLookedAtDuration !== undefined) {
    if (!validateNumber(component.minLookedAtDuration, 'minLookedAtDuration', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.min_looked_at_duration = component.minLookedAtDuration;
  }

  // Validate setTarget
  if (component.setTarget !== undefined) {
    if (!['never', 'once_and_stop_scanning', 'once_and_keep_scanning'].includes(component.setTarget)) {
      console.error('setTarget must be one of: never, once_and_stop_scanning, once_and_keep_scanning');

      return undefined;
    }
    result.set_target = component.setTarget;
  }

  return {
    'minecraft:looked_at': result,
  };
};
