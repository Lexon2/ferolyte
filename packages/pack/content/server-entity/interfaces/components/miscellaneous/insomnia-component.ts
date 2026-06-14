/**
 * Interface for the insomnia component
 * Adds a timer since last rested to see if phantoms should spawn.
 */
export interface InsomniaComponent {
  /**
   * Number of days the mob has to stay up until the insomnia effect begins
   * @default 3
   */
  daysUntilInsomnia: number;
}