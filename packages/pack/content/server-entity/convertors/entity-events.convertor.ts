import {
  ContentDiagnosticContext,
  withFieldPath,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { EntityEventRandomize } from '../interfaces/entity-events';
import { ServerEntityEvents } from '../interfaces/server-entity-config';
import { convertEntityFilters } from './common/filters.convertor';
import {
  validateBoolean,
  validateNumber,
  validateString,
  validateStringArray,
} from './common/validation';

const eventContext = (
  ctx: ContentDiagnosticContext | undefined,
  fieldPath?: string,
): ContentDiagnosticContext | undefined => {
  if (ctx === undefined) {
    return fieldPath !== undefined
      ? { section: 'events', fieldPath, contentType: 'server-entity' }
      : undefined;
  }

  return {
    ...ctx,
    section: 'events',
    component: undefined,
    fieldPath,
  };
};

/**
 * Converts an entity event node to Minecraft format. Recursive: used for event
 * roots and every `sequence` / `randomize` / `first_valid` item.
 * @param event The event to convert
 * @returns The event in Minecraft format or undefined if validation fails
 */
export const convertEntityEvent = (
  event: EntityEventRandomize | undefined,
  ctx?: ContentDiagnosticContext,
): { [key: string]: any } | undefined => {
  if (event === undefined) {
    return undefined;
  }

  const result: any = {};

  if (event.filters) {
    const convertedFilters = convertEntityFilters(
      event.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  if (event.add) {
    if (
      !validateStringArray(
        event.add.componentGroups,
        'add.componentGroups',
        ctx,
      )
    ) {
      return undefined;
    }
    result.add = {};
    result.add.component_groups = event.add.componentGroups;
  }

  if (event.remove) {
    if (
      !validateStringArray(
        event.remove.componentGroups,
        'remove.componentGroups',
        ctx,
      )
    ) {
      return undefined;
    }
    result.remove = {};
    result.remove.component_groups = event.remove.componentGroups;
  }

  if (event.trigger) {
    if (!validateString(event.trigger, 'trigger', ctx)) {
      return undefined;
    }
    result.trigger = event.trigger;
  }

  if (event.queueCommand) {
    if (!Array.isArray(event.queueCommand.command)) {
      if (
        !validateString(event.queueCommand.command, 'queueCommand.command', ctx)
      ) {
        return undefined;
      }
    } else if (
      !validateStringArray(
        event.queueCommand.command,
        'queueCommand.command',
        ctx,
      )
    ) {
      return undefined;
    }

    result.queue_command = {
      command: event.queueCommand.command,
      ...(event.queueCommand.target !== undefined && {
        target: event.queueCommand.target,
      }),
    };
  }

  if (event.setProperty) {
    result.set_property = {};
    for (const [key, value] of Object.entries(event.setProperty)) {
      result.set_property[key] =
        typeof value === 'object' ? value.build() : value;
    }
  }

  if (event.sequence) {
    const convertedSequence = event.sequence.map((item, index) =>
      convertEntityEvent(item, withFieldPath(ctx, `sequence[${index}]`)),
    );
    if (convertedSequence.some((item) => !item)) {
      return undefined;
    }

    result.sequence = convertedSequence;
  }

  if (event.randomize) {
    const convertedRandomize = event.randomize.map((item, index) =>
      convertEntityEvent(item, withFieldPath(ctx, `randomize[${index}]`)),
    );
    if (convertedRandomize.some((item) => !item)) {
      return undefined;
    }

    result.randomize = convertedRandomize;
  }

  if (event.firstValid) {
    const convertedFirstValid = event.firstValid.map((item, index) =>
      convertEntityEvent(item, withFieldPath(ctx, `firstValid[${index}]`)),
    );
    if (convertedFirstValid.some((item) => !item)) {
      return undefined;
    }

    result.first_valid = convertedFirstValid;
  }

  if (event.weight !== undefined) {
    if (!validateNumber(event.weight, 'weight', undefined, undefined, ctx)) {
      return undefined;
    }
    result.weight = event.weight;
  }

  if (event.stopMovement) {
    if (
      event.stopMovement.stopVerticalMovement === undefined ||
      event.stopMovement.stopHorizontalMovement === undefined
    ) {
      return undefined;
    }
    if (
      !validateBoolean(
        event.stopMovement.stopVerticalMovement,
        'stopMovement.stopVerticalMovement',
        ctx,
      ) ||
      !validateBoolean(
        event.stopMovement.stopHorizontalMovement,
        'stopMovement.stopHorizontalMovement',
        ctx,
      )
    ) {
      return undefined;
    }
    result.stop_movement = {
      stop_vertical_movement: event.stopMovement.stopVerticalMovement,
      stop_horizontal_movement: event.stopMovement.stopHorizontalMovement,
    };
  }

  if (event.setHomePosition) {
    if (!validateBoolean(event.setHomePosition, 'setHomePosition', ctx)) {
      return undefined;
    }
    if (event.setHomePosition) {
      result.set_home_position = {};
    }
  }

  if (event.playSound) {
    if (!validateString(event.playSound.sound, 'playSound.sound', ctx)) {
      return undefined;
    }
    result.play_sound = { sound: event.playSound.sound };
  }

  if (event.emitParticle) {
    if (
      !validateString(event.emitParticle.particle, 'emitParticle.particle', ctx)
    ) {
      return undefined;
    }
    result.emit_particle = { particle: event.emitParticle.particle };
  }

  if (event.resetTarget) {
    if (!validateBoolean(event.resetTarget, 'resetTarget', ctx)) {
      return undefined;
    }
    result.reset_target = event.resetTarget;
  }

  if (event.executeEventOnHomeBlock) {
    if (
      !validateString(
        event.executeEventOnHomeBlock.event,
        'executeEventOnHomeBlock.event',
        ctx,
      )
    ) {
      return undefined;
    }
    result.execute_event_on_home_block = {
      event: event.executeEventOnHomeBlock.event,
    };
  }

  if (event.emitVibration) {
    if (
      !validateString(
        event.emitVibration.vibration,
        'emitVibration.vibration',
        ctx,
      )
    ) {
      return undefined;
    }
    result.emit_vibration = { vibration: event.emitVibration.vibration };
  }

  return result;
};

export const convertEntityEvents = (
  events: ServerEntityEvents,
  ctx?: ContentDiagnosticContext,
): { [key: string]: any } | undefined => {
  const result: { [key: string]: any } = {};

  for (const eventName in events) {
    const convertedEvent = convertEntityEvent(
      events[eventName],
      eventContext(ctx, eventName),
    );
    if (convertedEvent) {
      result[eventName] = convertedEvent;
    }
  }

  return result;
};
