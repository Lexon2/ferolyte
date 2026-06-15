import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  RideableComponent,
  SeatsSpec,
} from '../../../interfaces/components/control/rideable-component';
import { convertTrigger } from '../../common/trigger.convertor';
import {
  validateBoolean,
  validateNumber,
  validateString,
  validateStringArray,
} from '../../common/validation';
import { validateRideableDismountMode } from '../../validation/rideable-dismount-mode';
/**
 * Converts a seat to Minecraft format
 * @param seat The seat to convert
 * @returns The seat in Minecraft format or undefined if validation fails
 */
const convertSeat = (seat: SeatsSpec): any => {
  const result: any = {};

  if (seat.dismountMode !== undefined) {
    if (!validateString(seat.dismountMode, 'dismountMode')) {
      return undefined;
    }
    result.dismount_mode = seat.dismountMode;
  }

  if (seat.thirdPersonCameraRadius !== undefined) {
    if (
      !validateNumber(seat.thirdPersonCameraRadius, 'thirdPersonCameraRadius')
    ) {
      return undefined;
    }
    result.third_person_camera_radius = seat.thirdPersonCameraRadius;
  }

  if (seat.cameraRelaxDistanceSmoothing !== undefined) {
    if (
      !validateNumber(
        seat.cameraRelaxDistanceSmoothing,
        'cameraRelaxDistanceSmoothing',
      )
    ) {
      return undefined;
    }
    result.camera_relax_distance_smoothing = seat.cameraRelaxDistanceSmoothing;
  }

  if (seat.lockRiderRotation !== undefined) {
    if (!validateNumber(seat.lockRiderRotation, 'lockRiderRotation')) {
      return undefined;
    }
    result.lock_rider_rotation = seat.lockRiderRotation;
  }

  if (seat.maxRiderCount !== undefined) {
    if (!validateNumber(seat.maxRiderCount, 'maxRiderCount')) {
      return undefined;
    }
    result.max_rider_count = seat.maxRiderCount;
  }

  if (seat.minRiderCount !== undefined) {
    if (!validateNumber(seat.minRiderCount, 'minRiderCount')) {
      return undefined;
    }
    result.min_rider_count = seat.minRiderCount;
  }

  if (seat.position !== undefined) {
    if (
      seat.position.length !== 3 ||
      !seat.position.every((value) => validateNumber(value, 'position'))
    ) {
      return undefined;
    }
    result.position = seat.position;
  }

  if (seat.rotateRiderBy !== undefined) {
    if (!validateNumber(seat.rotateRiderBy, 'rotateRiderBy')) {
      return undefined;
    }
    result.rotate_rider_by = seat.rotateRiderBy;
  }

  return result;
};

/**
 * Converts a RideableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertRideableComponent = (
  component: RideableComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:rideable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  if (component.controllingSeat !== undefined) {
    if (!validateNumber(component.controllingSeat, 'controllingSeat')) {
      return undefined;
    }
    result.controlling_seat = component.controllingSeat;
  }

  if (component.crouchingSkipInteract !== undefined) {
    if (
      !validateBoolean(component.crouchingSkipInteract, 'crouchingSkipInteract')
    ) {
      return undefined;
    }
    result.crouching_skip_interact = component.crouchingSkipInteract;
  }

  if (component.familyTypes !== undefined) {
    if (!validateStringArray(component.familyTypes, 'familyTypes')) {
      return undefined;
    }
    result.family_types = component.familyTypes;
  }

  if (component.interactText !== undefined) {
    if (!validateString(component.interactText, 'interactText')) {
      return undefined;
    }
    result.interact_text = component.interactText;
  }

  if (component.passengerMaxWidth !== undefined) {
    if (!validateNumber(component.passengerMaxWidth, 'passengerMaxWidth')) {
      return undefined;
    }
    result.passenger_max_width = component.passengerMaxWidth;
  }

  if (component.pullInEntities !== undefined) {
    if (!validateBoolean(component.pullInEntities, 'pullInEntities')) {
      return undefined;
    }
    result.pull_in_entities = component.pullInEntities;
  }

  if (component.riderCanInteract !== undefined) {
    if (!validateBoolean(component.riderCanInteract, 'riderCanInteract')) {
      return undefined;
    }
    result.rider_can_interact = component.riderCanInteract;
  }

  if (component.seatCount !== undefined) {
    if (!validateNumber(component.seatCount, 'seatCount')) {
      return undefined;
    }
    result.seat_count = component.seatCount;
  }

  if (component.seats !== undefined) {
    const seats = component.seats.map(convertSeat);
    if (seats.includes(undefined)) {
      return undefined;
    }
    result.seats = seats;
  }

  if (component.dismountMode !== undefined) {
    if (!validateRideableDismountMode(component.dismountMode)) {
      return undefined;
    }
    result.dismount_mode = component.dismountMode;
  }

  if (component.onRiderEnterEvent !== undefined) {
    const converted = convertTrigger(
      component.onRiderEnterEvent,
      withFieldPath(ctx, 'onRiderEnterEvent'),
    );
    if (converted === undefined) {
      return undefined;
    }
    //@TODO: Update this when 1.21.90 release
    result.on_rider_enter_event = converted.event;
  }

  if (component.onRiderExitEvent !== undefined) {
    const converted = convertTrigger(
      component.onRiderExitEvent,
      withFieldPath(ctx, 'onRiderExitEvent'),
    );
    if (converted === undefined) {
      return undefined;
    }
    //@TODO: Update this when 1.21.90 release
    result.on_rider_exit_event = converted.event;
  }

  return {
    'minecraft:rideable': result,
  };
};
