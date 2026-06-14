/**
 * Interface for the boss component
 * Defines special behaviors for boss entities
 */
export interface BossComponent {
  /**
   * Whether to darken the sky during the boss fight
   * @default false
   */
  shouldDarkenSky?: boolean;

  /**
   * Whether to play boss music during the boss fight
   * @default true
   */
  shouldPlayBossMusic?: boolean;

  /**
   * Text to display as the boss name
   */
  name?: string;

  /**
   * HUD range for boss health bar display
   * @default 50
   */
  hudRange?: number;
}
