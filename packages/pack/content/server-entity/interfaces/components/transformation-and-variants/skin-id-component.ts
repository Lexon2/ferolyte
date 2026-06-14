/**
 * Interface for the skin_id component
 * Skin ID value. Can be used to differentiate skins, such as base skins for villagers
 */
export interface SkinIdComponent {
  /**
   * The ID of the skin
   * By convention, 0 is the ID of the base skin
   * @default 0
   */
  value?: number;
}
