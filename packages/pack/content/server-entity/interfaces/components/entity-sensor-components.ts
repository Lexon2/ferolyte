import {
  BlockSensorComponent,
  EntitySensorComponent,
  DamageSensorComponent,
  EnvironmentSensorComponent,
  InsideBlockNotifierComponent,
  RailSensorComponent,
  TargetNearbySensorComponent
} from './sensors';

export interface EntitySensorComponents {
  blockSensor?: BlockSensorComponent;
  entitySensor?: EntitySensorComponent;
  damageSensor?: DamageSensorComponent;
  environmentSensor?: EnvironmentSensorComponent;
  insideBlockNotifier?: InsideBlockNotifierComponent;
  railSensor?: RailSensorComponent;
  targetNearbySensor?: TargetNearbySensorComponent;
}
