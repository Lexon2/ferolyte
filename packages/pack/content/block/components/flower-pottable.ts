/**
 * Creates a flower_pottable component for Minecraft blocks
 */
export const createFlowerPottable = (
  value?: boolean,
): { 'minecraft:flower_pottable': object } | undefined => {
  if (value === undefined || value === false) {
    return undefined;
  }

  return {
    'minecraft:flower_pottable': {},
  };
};
