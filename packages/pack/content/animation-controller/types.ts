import type { MolangExpression } from '../molang/parse-molang-expression';

/** Molang expression: a string or any Molang v2 builder (`q.isMoving`, `not(...)`, ...). */
export type ControllerMolang = MolangExpression;

/**
 * Transition list. Each item maps target state names to the Molang condition
 * of the transition; target names are checked against the controller `states`.
 */
export type ControllerTransitions<Target extends string = string> = Array<
  Partial<Record<Target, ControllerMolang>>
>;

/** Animation played in a state: a short name, or `{ name: blendExpression }`. */
export type ControllerAnimation = string | Record<string, ControllerMolang>;

export interface RpParticleEffect {
  effect: string;
  locator?: string;
  preEffectScript?: ControllerMolang;
  bindToActor?: boolean;
}

export interface RpSoundEffect {
  effect: string;
  locator?: string;
}

export interface RpStateVariable {
  input: ControllerMolang;
  /** `{ "0.0": 0, "1.0": 1 }` */
  remapCurve?: Record<string, number>;
}

/** State of a resource pack (client) animation controller. */
export interface RpState<Target extends string = string> {
  animations?: ControllerAnimation[];
  transitions?: ControllerTransitions<Target>;
  /** Seconds, or a curve `{ "0.0": 0, "1.0": 1 }`. */
  blendTransition?: number | Record<string, number>;
  blendViaShortestPath?: boolean;
  /** Molang statements (`;` is appended when missing), commands (`/...`) or events (`@s ...`). */
  onEntry?: ControllerMolang[];
  onExit?: ControllerMolang[];
  particleEffects?: RpParticleEffect[];
  soundEffects?: RpSoundEffect[];
  variables?: Record<string, RpStateVariable>;
}

/** State of a behavior pack (server) animation controller. */
export interface BpState<Target extends string = string> {
  animations?: ControllerAnimation[];
  transitions?: ControllerTransitions<Target>;
  /** Commands (`/say hi`), events (`@s namespace:event`) or Molang statements. */
  onEntry?: ControllerMolang[];
  onExit?: ControllerMolang[];
}

export type RpStateDefinition<Target extends string = string> =
  RpState<Target> & { readonly kind: 'rp' };

export type BpStateDefinition<Target extends string = string> =
  BpState<Target> & { readonly kind: 'bp' };

export type AnyStateDefinition = RpStateDefinition | BpStateDefinition;

export interface AnimationControllerConfig<
  States extends Record<string, AnyStateDefinition> = Record<
    string,
    AnyStateDefinition
  >,
> {
  /** Must start with `controller.animation.`. */
  id: `controller.animation.${string}`;
  /** Key of `states`. @default "default" */
  initialState?: Extract<keyof States, string>;
  /**
   * Reusable states by name. Transition targets are typed from these keys:
   * a state defined with `defineRpState<'idle' | 'walk'>()` can only point to them.
   */
  states: States;
  /** Format version of the output file. @default '1.10.0' */
  version?: string;
}
