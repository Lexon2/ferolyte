import {
  AddRiderComponent,
  BoostableComponent,
  DashActionComponent,
  FreeCameraControlledComponent,
  HorseJumpStrengthComponent,
  InputGroundControlledComponent,
  ItemControllableComponent,
  LeashableComponent,
  LeashableToComponent,
  RideableComponent,
  RotationLockedToVehicleComponent,
  VerticalMovementActionComponent,
} from './control';

export interface EntityControlComponents {
  addRider?: AddRiderComponent;
  boostable?: BoostableComponent;
  dashAction?: DashActionComponent;
  freeCameraControlled?: FreeCameraControlledComponent;
  horseJumpStrength?: HorseJumpStrengthComponent;
  inputGroundControlled?: InputGroundControlledComponent;
  itemControllable?: ItemControllableComponent;
  leashable?: LeashableComponent;
  leashableTo?: LeashableToComponent;
  rideable?: RideableComponent;
  rotationLockedToVehicle?: RotationLockedToVehicleComponent;
  verticalMovementAction?: VerticalMovementActionComponent;
}
