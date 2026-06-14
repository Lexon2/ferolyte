import { EntityFilters } from '../../filters';

/**
 * Interface for the celebrate-hunt component
 * Specifies hunt celebration behavior.
 */
export interface CelebrateHuntComponent {
  /**
   * If true, celebration will be broadcasted to other entities in the radius
   * @default false
   */
  broadcast?: boolean;

  /**
   * The list of conditions that target of hunt must satisfy to initiate celebration
   */
  celebrationTargets?: EntityFilters;

  /**
   * The sound event to play when the mob is celebrating
   */
  celebrateSound?: string;

  /**
   * Duration, in seconds, of celebration
   * @default 5
   */
  duration?: number;

  /**
   * If broadcast is enabled, specifies the radius in which it will notify other entities for celebration
   * @default 16
   */
  radius?: number;

  /**
   * The range of time in seconds to randomly wait before playing the sound again
   * @default [2.0, 5.0]
   */
  soundInterval?: number | [number, number] | {
    /**
     * Minimum time in seconds
     * @default 2.0
     */
    rangeMin: number;
    /**
     * Maximum time in seconds
     * @default 5.0
     */
    rangeMax: number;
  };
}
