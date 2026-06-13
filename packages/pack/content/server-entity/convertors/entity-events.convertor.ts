import {
  EntityEventBase,
  EntityEventRandomize,
  EntityEvents,
} from '../interfaces/entity-events';
import { ServerEntityEvents } from '../interfaces/server-entity-config';
import { convertEntityFilters } from './common/filters.convertor';
import {
  validateBoolean,
  validateNumber,
  validateString,
  validateStringArray,
} from './common/validation';

export const convertEntityEventBase = (
  event: EntityEventBase,
): { [key: string]: any } | undefined => {
  const result: any = {};

  // Validate filters
  if (event.filters) {
    const convertedFilters = convertEntityFilters(event.filters);
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate add
  if (event.add) {
    if (
      !validateStringArray(event.add.componentGroups, 'add.componentGroups')
    ) {
      return undefined;
    }
    result.add = {};
    result.add.component_groups = event.add.componentGroups;
  }

  // Validate remove
  if (event.remove) {
    if (
      !validateStringArray(
        event.remove.componentGroups,
        'remove.componentGroups',
      )
    ) {
      return undefined;
    }
    result.remove = {};
    result.remove.component_groups = event.remove.componentGroups;
  }

  // Validate trigger
  if (event.trigger) {
    if (!validateString(event.trigger, 'trigger')) {
      return undefined;
    }
    result.trigger = event.trigger;
  }

  // Validate queueCommand
  if (event.queueCommand) {
    if (!Array.isArray(event.queueCommand.command)) {
      if (!validateString(event.queueCommand.command, 'queueCommand.command')) {
        return undefined;
      }
    } else {
      if (
        !validateStringArray(event.queueCommand.command, 'queueCommand.command')
      ) {
        return undefined;
      }
    }
    result.queue_command = event.queueCommand;
  }

  // Validate setProperty
  if (event.setProperty) {
    // This field does not need to be validated as it is a freeform object
    result.set_property = event.setProperty;
  }

  return result;
};

export const convertEntityEventRandomize = (
  event: EntityEventRandomize,
): { [key: string]: any } | undefined => {
  const result: any = {};

  const base = convertEntityEventBase(event);
  if (!base) {
    return undefined;
  }

  if (event.weight !== undefined) {
    if (!validateNumber(event.weight, 'weight')) {
      return undefined;
    }
    result.weight = event.weight;
  }

  return result;
};

/**
 * Converts an EntityEvent to Minecraft format
 * @param event The event to convert
 * @returns The event in Minecraft format or undefined if validation fails
 */
export const convertEntityEvent = (
  event: EntityEvents | undefined,
): { [key: string]: any } | undefined => {
  if (event === undefined) {
    return undefined;
  }

  const result: { [key: string]: any } = convertEntityEventBase(event) ?? {};

  // Validate sequence
  if (event.sequence) {
    const convertedSequence = event.sequence.map(convertEntityEventBase);
    if (convertedSequence.some((item) => !item)) {
      return undefined;
    }

    result.sequence = convertedSequence;
  }

  // Validate randomize
  if (event.randomize) {
    const convertedRandomize = event.randomize.map(convertEntityEventRandomize);
    if (convertedRandomize.some((item) => !item)) {
      return undefined;
    }

    result.randomize = convertedRandomize;
  }

  // Validate firstValid
  if (event.firstValid) {
    const convertedFirstValid = event.firstValid.map(convertEntityEventBase);
    if (convertedFirstValid.some((item) => !item)) {
      return undefined;
    }
  }

  // Validate stopMovement
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
      ) ||
      !validateBoolean(
        event.stopMovement.stopHorizontalMovement,
        'stopMovement.stopHorizontalMovement',
      )
    ) {
      return undefined;
    }
    result.stop_movement = event.stopMovement;
  }

  // Validate setHomePosition
  if (event.setHomePosition) {
    if (!validateBoolean(event.setHomePosition, 'setHomePosition')) {
      return undefined;
    }
    if (event.setHomePosition) {
      result.set_home_position = {};
    }
  }

  // Validate playSound
  if (event.playSound) {
    if (!validateString(event.playSound.sound, 'playSound.sound')) {
      return undefined;
    }
    result.play_sound = event.playSound;
  }

  // Validate emitParticle
  if (event.emitParticle) {
    if (!validateString(event.emitParticle.particle, 'emitParticle.particle')) {
      return undefined;
    }
    result.emit_particle = event.emitParticle;
  }

  // Validate resetTarget
  if (event.resetTarget) {
    if (!validateBoolean(event.resetTarget, 'resetTarget')) {
      return undefined;
    }
    result.reset_target = event.resetTarget;
  }

  // Validate executeEventOnHomeBlock
  if (event.executeEventOnHomeBlock) {
    if (
      !validateString(
        event.executeEventOnHomeBlock.event,
        'executeEventOnHomeBlock.event',
      )
    ) {
      return undefined;
    }
    result.execute_event_on_home_block = event.executeEventOnHomeBlock;
  }

  return result;
};

export const convertEntityEvents = (
  events: ServerEntityEvents,
): { [key: string]: any } | undefined => {
  const result: { [key: string]: any } = {};

  for (const event in events) {
    const convertedEvent = convertEntityEvent(events[event]);
    if (convertedEvent) {
      result[event] = convertedEvent;
    }
  }

  return result;
};
