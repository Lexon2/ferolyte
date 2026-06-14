/**
 * Interface for the experience_reward component
 * Defines the amount of experience rewarded when the entity dies or is successfully bred.
 */
export interface ExperienceRewardComponent {
  /**
   * A molang expression defining the amount of experience rewarded when this entity is successfully bred
   * An array of expressions adds each expression's result together for a final total
   * @default 0
   */
  onBred?: string | number | (string | number)[];

  /**
   * A molang expression defining the amount of experience rewarded when this entity dies
   * An array of expressions adds each expression's result together for a final total
   * @default 0
   */
  onDeath?: string | number | (string | number)[];
}
