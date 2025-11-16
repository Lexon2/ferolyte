import { Vector3 } from '@minecraft/server';

/**
 * Creates a list of locations in a diamond/rhombus shape around a center point
 * @param centerLocation - The center location of the diamond
 * @param radius - The radius (maximum distance from center)
 * @returns Array of locations forming a diamond shape
 */
export const createDiamondLocations = (
  centerLocation: Vector3,
  radius: number,
): Vector3[] => {
  const { x: cX, y: cY, z: cZ } = centerLocation;

  const locations: Vector3[] = [];

  for (let x = -radius; x <= radius; x++) {
    const remainingDistance = radius - Math.abs(x);

    for (let z = -remainingDistance; z <= remainingDistance; z++) {
      locations.push({
        x: cX + x,
        y: cY,
        z: cZ + z,
      });
    }
  }

  return locations;
};
