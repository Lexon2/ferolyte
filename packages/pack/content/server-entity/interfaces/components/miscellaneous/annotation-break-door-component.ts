/**
 * Interface for the annotation.break_door component
 * Allows the actor to break doors assuming that that flags set up for the component to use in navigation.
 */
export interface AnnotationBreakDoorComponent {
  /**
   * The time in seconds required to break through doors
   * @default 12
   */
  breakTime?: number;

  /**
   * The minimum difficulty that the world must be on for this entity to break doors
   * @default "hard"
   */
  minDifficulty?: string;
}
