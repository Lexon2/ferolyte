import type {
  BpState,
  BpStateDefinition,
  RpState,
  RpStateDefinition,
} from './types';

/**
 * Defines a reusable resource pack (client) controller state.
 * Pass the target names to type its transitions: `defineRpState<'idle' | 'walk'>({...})`.
 */
export const defineRpState = <Target extends string = string>(
  state: RpState<Target>,
): RpStateDefinition<Target> => ({ ...state, kind: 'rp' });

/**
 * Defines a reusable behavior pack (server) controller state.
 */
export const defineBpState = <Target extends string = string>(
  state: BpState<Target>,
): BpStateDefinition<Target> => ({ ...state, kind: 'bp' });
