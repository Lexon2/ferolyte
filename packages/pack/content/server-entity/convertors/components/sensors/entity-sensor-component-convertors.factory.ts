import { convertBlockSensorComponent } from './block-sensor-component.convertor';
import { convertDamageSensorComponent } from './damage-sensor-component.convertor';
import { convertEntitySensorComponent } from './entity-sensor-component.convertor';
import { convertEnvironmentSensorComponent } from './environment-sensor-component.convertor';
import { convertInsideBlockNotifierComponent } from './inside-block-notifier-component.convertor';
import { convertRailSensorComponent } from './rail-sensor-component.convertor';
import { convertTargetNearbySensorComponent } from './target-nearby-sensor-component.convertor';

export const entitySensorComponentConvertorsFactory = {
  blockSensor: convertBlockSensorComponent,
  entitySensor: convertEntitySensorComponent,
  damageSensor: convertDamageSensorComponent,
  environmentSensor: convertEnvironmentSensorComponent,
  insideBlockNotifier: convertInsideBlockNotifierComponent,
  railSensor: convertRailSensorComponent,
  targetNearbySensor: convertTargetNearbySensorComponent
};
