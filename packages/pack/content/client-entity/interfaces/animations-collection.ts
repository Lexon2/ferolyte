import type { Molang } from '../../molang/molang';
import { ClientEntityAnimationsName } from '../types/entity-script-animations-collections';

/**
 * Animation reference with build-time options. The referenced `.animation.json`
 * is never modified: when options are set, the compiler writes a patched copy
 * under a derived id and the entity points to it.
 */
export interface ClientEntityAnimationOptions {
  /** Animation id from the source `.animation.json`. */
  id: ClientEntityAnimationsName;

  /**
   * Playback speed multiplier, written as
   * `anim_time_update = query.anim_time + query.delta_time * (<speed>)`.
   */
  speed?: number | string | Molang;

  /** Options added by plugins through `registerAnimationOption`. */
  [option: string]: unknown;
}

export type ClientEntityAnimationValue =
  | ClientEntityAnimationsName
  | ClientEntityAnimationOptions;

export interface ClientEntityAnimationsCollection {
  [key: string]: ClientEntityAnimationValue;
}

/**
 * Resolves an animation with options to the id written into the entity.
 * Installed by the compiler; without it the original id is used.
 */
export type ClientEntityAnimationResolver = (
  entityIdentifier: string,
  key: string,
  options: ClientEntityAnimationOptions,
) => string;
