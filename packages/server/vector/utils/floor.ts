import { Vector3 } from '@minecraft/server';

export const floor = (vector: Vector3): Vector3 => {
  return {
    x: Math.floor(vector.x),
    y: Math.floor(vector.y),
    z: Math.floor(vector.z),
  };
};
