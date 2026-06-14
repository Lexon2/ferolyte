import { convertDryingOutTimerComponent } from './drying-out-timer-component.convertor';
import { convertSchedulerComponent } from './scheduler-component.convertor';
import { convertTimerComponent } from './timer-component';

export const entityTimerComponentConvertorsFactory = {
  dryingOutTimer: convertDryingOutTimerComponent,
  scheduler: convertSchedulerComponent,
  timer: convertTimerComponent
};
