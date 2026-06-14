import { EntityFilters } from '../../filters';

/**
 * Interface for the anger_level component
 * Allows this entity to track anger towards a set of nuisances
 */
export interface AngerLevelComponent {
  /**
   * Anger level will decay over time. Defines how often anger towards all nuisances will be decreased by one
   * @default 1.0
   */
  angerDecrementInterval?: number;

  /**
   * Anger boost applied to angry threshold when mob gets angry
   * @default 20
   */
  angryBoost?: number;

  /**
   * Threshold that define when the mob is considered angry at a nuisance
   * @default 80
   */
  angryThreshold?: number;

  /**
   * The default amount of annoyingness for any given nuisance. Specifies how much to raise anger level on each provocation
   * @default 0
   */
  defaultAnnoyingness?: number;

  /**
   * The default amount of annoyingness for projectile nuisance. Specifies how much to raise anger level on each provocation
   * @default 0
   */
  defaultProjectileAnnoyingness?: number;

  /**
   * The maximum anger level that can be reached. Applies to any nuisance
   * @default 100
   */
  maxAnger?: number;

  /**
   * Filter that is applied to determine if a mob can be a nuisance
   */
  nuisanceFilter?: EntityFilters;

  /**
   * The sounds to play when anger level increases
   */
  onIncreaseSounds?: Array<{
    /**
     * The event that will trigger the sound
     */
    condition: string;
    /**
     * The sound to play
     */
    sound: string;
  }>;

  /**
   * Defines if the mob should remove target if it falls below 'angry' threshold
   * @default true
   */
  removeTargetsBelowAngryThreshold?: boolean;
}
