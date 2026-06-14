import { TimerFlag1Behavior } from './timer-flag-1-behavior';

/**
 * Fires an event when this behavior starts, then waits for a duration before stopping. When stopping due to that timeout or due to being interrupted by another behavior, fires another event.
 */
export interface TimerFlag2Behavior extends TimerFlag1Behavior {}
