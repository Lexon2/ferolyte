import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { AngryComponent } from '../../../interfaces/components/ai/angry-component';
import { convertRange } from '../../common/convertors';
import { convertEntityFilters } from '../../common/filters.convertor';
import { convertTrigger } from '../../common/trigger.convertor';
import {
  validateNumber,
  validateString,
  validateBoolean,
} from '../../common/validation';

/**
 * Converts an AngryComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertAngryComponent = (
  component: Partial<AngryComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:angry': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate broadcastAnger
  if (component.broadcastAnger !== undefined) {
    if (!validateBoolean(component.broadcastAnger, 'broadcastAnger')) {
      return undefined;
    }
    result.broadcast_anger = component.broadcastAnger;
  }

  // Validate broadcastFilters
  if (component.broadcastFilters !== undefined) {
    const convertedBroadcastFilters = convertEntityFilters(component.broadcastFilters, withFieldPath(ctx, 'broadcastFilters'));
    if (!convertedBroadcastFilters) {
      return undefined;
    }
    result.broadcast_filters = convertedBroadcastFilters;
  }

  // Validate filters
  if (component.filters !== undefined) {
    const convertedFilters = convertEntityFilters(component.filters, withFieldPath(ctx, 'filters'));
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  // Validate broadcastRange
  if (component.broadcastRange !== undefined) {
    if (
      !validateNumber(
        component.broadcastRange,
        'broadcastRange',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.broadcast_range = component.broadcastRange;
  }

  // Validate broadcastTargets
  if (component.broadcastTargets !== undefined) {
    if (!Array.isArray(component.broadcastTargets)) {
      console.error('broadcastTargets must be an array');

      return undefined;
    }
    for (const target of component.broadcastTargets) {
      if (!validateString(target, 'broadcastTargets item')) {
        return undefined;
      }
    }
    result.broadcast_targets = component.broadcastTargets;
  }

  // Validate calmEvent
  if (component.calmEvent !== undefined) {
    const convertedCalmEvent = convertTrigger(component.calmEvent, withFieldPath(ctx, 'calmEvent'));
    if (!convertedCalmEvent) {
      return undefined;
    }
    result.calm_event = component.calmEvent;
  }

  // Validate angrySound
  if (component.angrySound !== undefined) {
    if (!validateString(component.angrySound, 'angrySound')) {
      return undefined;
    }
    result.angry_sound = component.angrySound;
  }

  // Validate broadcastAngerOnAttack
  if (component.broadcastAngerOnAttack !== undefined) {
    if (
      !validateBoolean(
        component.broadcastAngerOnAttack,
        'broadcastAngerOnAttack',
      )
    ) {
      return undefined;
    }
    result.broadcast_anger_on_attack = component.broadcastAngerOnAttack;
  }

  // Validate broadcastAngerOnBeingAttacked
  if (component.broadcastAngerOnBeingAttacked !== undefined) {
    if (
      !validateBoolean(
        component.broadcastAngerOnBeingAttacked,
        'broadcastAngerOnBeingAttacked',
      )
    ) {
      return undefined;
    }
    result.broadcast_anger_on_being_attacked =
      component.broadcastAngerOnBeingAttacked;
  }

  // Validate broadcastAngerWhenDying
  if (component.broadcastAngerWhenDying !== undefined) {
    if (
      !validateBoolean(
        component.broadcastAngerWhenDying,
        'broadcastAngerWhenDying',
      )
    ) {
      return undefined;
    }
    result.broadcast_anger_when_dying = component.broadcastAngerWhenDying;
  }

  // Validate duration
  if (component.duration !== undefined) {
    if (!validateNumber(component.duration, 'duration', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.duration = component.duration;
  }

  // Validate durationDelta
  if (component.durationDelta !== undefined) {
    if (
      !validateNumber(
        component.durationDelta,
        'durationDelta',
        0,
        Number.MAX_VALUE,
      )
    ) {
      return undefined;
    }
    result.duration_delta = component.durationDelta;
  }

  // Validate soundInterval
  if (component.soundInterval !== undefined) {
    const convertedSoundInterval = convertRange(
      component.soundInterval,
      'soundInterval',
    );
    if (!convertedSoundInterval) {
      return undefined;
    }
    result.sound_interval = convertedSoundInterval;
  }

  return {
    'minecraft:angry': result,
  };
};
