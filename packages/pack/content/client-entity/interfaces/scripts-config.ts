import { OneOfRecord } from '@artifex/common/types/core/one-of-record';
import { MolangMath, MolangQuery } from '../../molang/types';

type AnimationKeys<T> =
  T extends Record<infer K extends string, string>
    ? K | OneOfRecord<K, MolangMath | MolangQuery>
    : never;

/**
 * The configuration for the entity's scripts.
 */
export interface ClientEntityScriptsConfig<
  A extends Record<string, string> | undefined = undefined,
> {
  /**
   * The array of items to animate.
   */
  animate?: A extends undefined ? string[] : AnimationKeys<A>[];

  /**
   * Clientside molang variables that are to be evaluated during the creation of the entity.
   */
  initialize?: `${string};`[];

  /**
   * Clientside molang variables that are to be evaluated during the animation.
   */
  preAnimation?: `${string};`[];

  /**
   * The minecraft molang definition that results in a float.
   */
  parentSetup?: string[];

  /**
   * The scale of the mob's geometry.
   */
  variables?: {
    [key in `variable.${string}` | (string & {})]?: 'public';
  };

  /**
   * The scale of the mob's geometry.
   */
  scale?: string;

  /**
   * The scale x of the mob's geometry.
   */
  scalex?: number | string;

  /**
   * The scale y of the mob's geometry.
   */
  scaley?: number | string;

  /**
   * The scale z of the mob's geometry.
   */
  scalez?: number | string;

  /**
   * Bones and effects will still be updated if the entity is off screen if this expression returns anything other than 0.0.
   */
  shouldUpdateBonesAndEffectsOffscreen?: true;

  /**
   * Effects will still be updated if the entity is off screen if this expression or `should_update_bones_and_effects_offscreen` returns anything other than 0.0.
   */
  shouldUpdateEffectsOffscreen?: true;
}
