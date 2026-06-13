type Vector3 = [number, number, number];

interface CollisionBoxOptions {
  origin?: Vector3;
  size?: Vector3;
}

const convertCollisionBoxEntry = (
  options: CollisionBoxOptions,
): { origin?: Vector3; size?: Vector3 } | undefined => {
  const result: any = {};

  if (options.origin !== undefined) {
    if (
      !Array.isArray(options.origin) ||
      options.origin.length !== 3 ||
      !options.origin.every((val) => typeof val === 'number')
    ) {
      console.error('Origin must be a Vector3 array with 3 numeric values');

      return undefined;
    }
    result.origin = options.origin;
  }

  if (options.size !== undefined) {
    if (
      !Array.isArray(options.size) ||
      options.size.length !== 3 ||
      !options.size.every((val) => typeof val === 'number')
    ) {
      console.error('Size must be a Vector3 array with 3 numeric values');

      return undefined;
    }
    result.size = options.size;
  }

  return result;
};

/**
 * Creates a collision_box component for Minecraft blocks
 * @param options The collision box options or boolean for simplified usage
 * @returns The collision_box component in Minecraft format or undefined if validation fails
 */
export const createCollisionBox = (
  options?: boolean | CollisionBoxOptions | CollisionBoxOptions[],
): {
  'minecraft:collision_box':
    | boolean
    | CollisionBoxOptions
    | CollisionBoxOptions[];
} | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (typeof options === 'boolean') {
    return {
      'minecraft:collision_box': options,
    };
  }

  if (Array.isArray(options)) {
    const boxes: Array<{ origin?: Vector3; size?: Vector3 }> = [];

    for (const box of options) {
      const converted = convertCollisionBoxEntry(box);
      if (converted === undefined) {
        return undefined;
      }
      boxes.push(converted);
    }

    return {
      'minecraft:collision_box': boxes,
    };
  }

  if (typeof options === 'object' && options !== null) {
    const converted = convertCollisionBoxEntry(options);
    if (converted === undefined) {
      return undefined;
    }

    return {
      'minecraft:collision_box': converted,
    };
  }

  console.error('Collision box must be a boolean or an object with valid properties');

  return undefined;
};
