import { AnimationControllerBuilder } from './animation-controller-builder';
import type {
  AnimationControllerConfig,
  AnyStateDefinition,
  BpStateDefinition,
  RpStateDefinition,
} from './types';

/** `states` with transition targets restricted to the keys of `states`. */
type TypedStates<States extends Record<string, AnyStateDefinition>> = {
  [Name in keyof States]: States[Name] extends { kind: 'bp' }
    ? BpStateDefinition<Extract<keyof States, string>>
    : RpStateDefinition<Extract<keyof States, string>>;
};

/**
 * Creates an animation controller. Transition targets are typed from the keys
 * of `states`, so a typo in a target is a compile error.
 */
export const createAnimationController = <
  States extends Record<string, AnyStateDefinition>,
>(
  config: AnimationControllerConfig<States> & { states: TypedStates<States> },
): AnimationControllerBuilder =>
  new AnimationControllerBuilder(
    config as unknown as AnimationControllerConfig,
  );
