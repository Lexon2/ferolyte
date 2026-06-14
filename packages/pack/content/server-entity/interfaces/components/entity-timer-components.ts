import {
  DryingOutTimerComponent,
  SchedulerComponent,
  TimerComponent
} from './timers-and-schedulers';

export interface EntityTimerComponents {
  dryingOutTimer?: DryingOutTimerComponent;
  scheduler?: SchedulerComponent;
  timer?: TimerComponent;
}
