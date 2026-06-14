import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  EntitySensorComponent,
  Subsensor,
} from '../../../interfaces/components/sensors/entity-sensor-component';
import { convertEntityFilters } from '../../common/filters.convertor';
import {
  validateNumber,
  validateBoolean,
  validateString,
  validateVector2,
} from '../../common/validation';

/**
 * Converts a Subsensor to Minecraft format
 * @param subsensor The subsensor to convert
 * @returns The converted subsensor or undefined if validation fails
 */
const convertSubsensor = (
  subsensor: Subsensor,
  ctx?: ContentDiagnosticContext,
): Record<string, any> | undefined => {
  const result: Record<string, any> = {};

  if (subsensor.cooldown !== undefined) {
    if (!validateNumber(subsensor.cooldown, 'cooldown')) {
      return undefined;
    }
    result.cooldown = subsensor.cooldown;
  }

  if (subsensor.yOffset !== undefined) {
    if (!validateNumber(subsensor.yOffset, 'y_offset')) {
      return undefined;
    }
    result.y_offset = subsensor.yOffset;
  }

  if (subsensor.eventFilters) {
    const eventFilters = convertEntityFilters(subsensor.eventFilters, withFieldPath(ctx, 'eventFilters'));
    if (!eventFilters) {
      return undefined;
    }

    result.event_filters = eventFilters;
  }

  if (!validateString(subsensor.event, 'event')) {
    return undefined;
  }
  result.event = subsensor.event;

  if (subsensor.maximumCount !== undefined) {
    if (!validateNumber(subsensor.maximumCount, 'maximum_count')) {
      return undefined;
    }
    result.maximum_count = subsensor.maximumCount;
  }

  if (subsensor.minimumCount !== undefined) {
    if (!validateNumber(subsensor.minimumCount, 'minimum_count')) {
      return undefined;
    }
    result.minimum_count = subsensor.minimumCount;
  }

  if (subsensor.range !== undefined) {
    if (!validateVector2(subsensor.range, 'range')) {
      return undefined;
    }
    result.range = subsensor.range;
  }

  if (subsensor.requireAll !== undefined) {
    if (!validateBoolean(subsensor.requireAll, 'require_all')) {
      return undefined;
    }
    result.require_all = subsensor.requireAll;
  }

  if (subsensor.sensorRange !== undefined) {
    if (!validateNumber(subsensor.sensorRange, 'sensor_range')) {
      return undefined;
    }
    result.sensor_range = subsensor.sensorRange;
  }

  return result;
};

/**
 * Converts an EntitySensorComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertEntitySensorComponent = (
  component: Partial<EntitySensorComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, any> = {
    'minecraft:entity_sensor': {},
  };

  if (component.relativeRange !== undefined) {
    if (!validateBoolean(component.relativeRange, 'relative_range')) {
      return undefined;
    }
    result['minecraft:entity_sensor'].relative_range = component.relativeRange;
  }

  if (component.subsensors) {
    const subsensors = component.subsensors
      .map((subsensor, index) =>
        convertSubsensor(subsensor, withFieldPath(ctx, `subsensors[${index}]`)),
      )
      .filter(Boolean);

    if (subsensors.length > 0) {
      result['minecraft:entity_sensor'].subsensors = subsensors;
    }
  }

  if (component.findPlayersOnly !== undefined) {
    if (!validateBoolean(component.findPlayersOnly, 'find_players_only')) {
      return undefined;
    }
    result['minecraft:entity_sensor'].find_players_only =
      component.findPlayersOnly;
  }

  return result;
};
