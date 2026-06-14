/**
 * Interface for the variant component
 * Used to differentiate the component group of a variant of an entity from others (e.g. ocelot, villager)
 */
export interface VariantComponent {
  /**
   * The ID of the variant. By convention, 0 is the ID of the base entity
   * @default 0
   */
  value: number;
}
