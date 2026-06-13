import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { logContentError } from '../../../common/diagnostics/content-diagnostic';
import { validateVector3 } from '../../../common/validation/content-validation';

type Vector3 = [number, number, number];

interface CollisionBoxOptions {
  origin?: Vector3;
  size?: Vector3;
}

const convertCollisionBoxEntry = (
  options: CollisionBoxOptions,
  ctx?: ContentDiagnosticContext,
  index?: number,
): { origin?: Vector3; size?: Vector3 } | undefined => {
  const entryContext =
    ctx !== undefined && index !== undefined
      ? { ...ctx, fieldPath: `[${index}]` }
      : ctx;

  const result: any = {};

  if (options.origin !== undefined) {
    if (
      !validateVector3(
        options.origin,
        entryContext,
        'Origin must be a Vector3 array with 3 numeric values',
        'origin',
      )
    ) {
      return undefined;
    }
    result.origin = options.origin;
  }

  if (options.size !== undefined) {
    if (
      !validateVector3(
        options.size,
        entryContext,
        'Size must be a Vector3 array with 3 numeric values',
        'size',
      )
    ) {
      return undefined;
    }
    result.size = options.size;
  }

  return result;
};

/**
 * Creates a collision_box component for Minecraft blocks
 */
export const createCollisionBox = (
  options?: boolean | CollisionBoxOptions | CollisionBoxOptions[],
  ctx?: ContentDiagnosticContext,
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

    for (let index = 0; index < options.length; index++) {
      const converted = convertCollisionBoxEntry(options[index], ctx, index);
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
    const converted = convertCollisionBoxEntry(options, ctx);
    if (converted === undefined) {
      return undefined;
    }

    return {
      'minecraft:collision_box': converted,
    };
  }

  logContentError(
    ctx,
    'Collision box must be a boolean or an object with valid properties',
  );
  return undefined;
};
