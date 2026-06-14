/**
 * Interface for the npc component
 * Sets this entity as an NPC
 */
export interface NpcComponent {
  /**
   * The data belonging to this npc
   */
  npcData?: {
    /**
     * Portrait offsets
     */
    portraitOffsets?: {
      /**
       * Translate offset
       */
      translate?: [number, number, number];
      /**
       * Scale offset
       */
      scale?: [number, number, number];
    };
    /**
     * Picker offsets
     */
    pickerOffsets?: {
      /**
       * Translate offset
       */
      translate?: [number, number, number];
      /**
       * Scale offset
       */
      scale?: [number, number, number];
    };
    /**
     * Skin list
     */
    skinList?: Array<{
      /**
       * Variant
       */
      variant?: number;
      /**
       * Mark variant
       */
      markVariant?: number;
    }>;
  };
}
