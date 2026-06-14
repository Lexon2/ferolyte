/**
 * Interface for the mark_variant component
 * Additional variant value. Can be used to further differentiate variants.
 */
export interface MarkVariantComponent {
  /**
   * The ID of the variant. By convention, 0 is the ID of the base entity
   * @default 0
   */
  value: number;
}
