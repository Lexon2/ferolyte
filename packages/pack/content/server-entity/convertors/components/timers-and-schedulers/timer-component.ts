import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { TimerComponent } from '../../../interfaces/components/timers-and-schedulers/timer-component';
import { validateBoolean } from '../../common/validation';
import { validateTime } from '../../common/validation';
import { validateWeight } from '../../common/validation';

/**
 * Converts a TimerComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertTimerComponent = (
  component: Partial<TimerComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:timer': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate looping
  if (component.looping !== undefined) {
    if (!validateBoolean(component.looping, 'looping')) {
      return undefined;
    }
    result.looping = component.looping;
  }

  // Validate randomInterval
  if (component.randomInterval !== undefined) {
    if (!validateBoolean(component.randomInterval, 'randomInterval')) {
      return undefined;
    }
    result.random_interval = component.randomInterval;
  }

  // Validate time
  if (component.time !== undefined) {
    if (!validateTime(component.time, 'time')) {
      return undefined;
    }
    result.time = component.time;
  }

  // Validate timeDownEvent
  if (component.timeDownEvent !== undefined) {
    if (typeof component.timeDownEvent !== 'object' || component.timeDownEvent === null) {
      console.error('timeDownEvent must be an object');

      return undefined;
    }
    result.time_down_event = component.timeDownEvent;
  }

  // Validate randomTimeChoices
  if (component.randomTimeChoices !== undefined) {
    if (!Array.isArray(component.randomTimeChoices)) {
      console.error('randomTimeChoices must be an array');

      return undefined;
    }

    result.random_time_choices = component.randomTimeChoices.map(choice => {
      if (typeof choice !== 'object' || choice === null) {
        console.error('Each random time choice must be an object');

        return undefined;
      }

      const convertedChoice: any = {};

      // Validate weight
      if (choice.weight !== undefined) {
        if (!validateWeight(choice.weight, 'weight')) {
          return undefined;
        }
        convertedChoice.weight = choice.weight;
      }

      // Validate value
      if (!validateTime(choice.value, 'value')) {
        return undefined;
      }
      convertedChoice.value = choice.value;

      return convertedChoice;
    });

    if (result.random_time_choices.some((choice: any) => choice === undefined)) {
      return undefined;
    }
  }

  return {
    'minecraft:timer': result
  };
};
