import { convertAddriderComponent } from './addrider-component.convertor';
import { convertBoostableComponent } from './boostable-component.convertor';
import { convertDashActionComponent } from './dash-action-component.convertor';
import { convertFreeCameraControlledComponent } from './free-camera-controlled-component.convertor';
import { convertHorseJumpStrengthComponent } from './horse-jump-strength-component.convertor';
import { convertInputGroundControlledComponent } from './input-ground-controlled-component.convertor';
import { convertItemControllableComponent } from './item-controllable-component.convertor';
import { convertLeashableComponent } from './leashable-component.convertor';
import { convertLeashableToComponent } from './leashable-to-component.convertor';
import { convertRideableComponent } from './rideable-component.convertor';
import { convertRotationLockedToVehicleComponent } from './rotation-locked-to-vehicle-component.convertor';
import { convertVerticalMovementActionComponent } from './vertical-movement-action-component.convertor';

export const entityControlComponentConvertorsFactory = {
  addRider: convertAddriderComponent,
  boostable: convertBoostableComponent,
  dashAction: convertDashActionComponent,
  freeCameraControlled: convertFreeCameraControlledComponent,
  horseJumpStrength: convertHorseJumpStrengthComponent,
  inputGroundControlled: convertInputGroundControlledComponent,
  itemControllable: convertItemControllableComponent,
  leashable: convertLeashableComponent,
  leashableTo: convertLeashableToComponent,
  rideable: convertRideableComponent,
  rotationLockedToVehicle: convertRotationLockedToVehicleComponent,
  verticalMovementAction: convertVerticalMovementActionComponent,
};
