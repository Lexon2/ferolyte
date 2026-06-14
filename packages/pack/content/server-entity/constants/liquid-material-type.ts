/**
 * The material type of the liquid block to find
 */
export type LiquidMaterialType = 'Air' | 'Any' | 'Lava' | 'Water';

export const LIQUID_MATERIAL_TYPE: LiquidMaterialType[] = [
  'Air',
  'Any',
  'Lava',
  'Water',
] as const;
