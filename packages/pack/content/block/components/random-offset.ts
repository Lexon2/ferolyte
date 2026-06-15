import {
  RandomOffsetAxis,
  RandomOffsetComponent,
} from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { validateNumber } from '@ferolyte/common/content/validation/content-validation';

const convertAxis = (
  axis: RandomOffsetAxis | undefined,
  ctx: ContentDiagnosticContext | undefined,
  axisName: string,
): any | undefined => {
  if (axis === undefined) {
    return undefined;
  }

  const result: any = {};

  if (axis.range !== undefined) {
    const range: any = {};
    if (axis.range.min !== undefined) {
      if (
        !validateNumber(
          axis.range.min,
          ctx,
          'Random offset range min must be a number',
          `${axisName}.range.min`,
        )
      ) {
        return undefined;
      }
      range.min = axis.range.min;
    }
    if (axis.range.max !== undefined) {
      if (
        !validateNumber(
          axis.range.max,
          ctx,
          'Random offset range max must be a number',
          `${axisName}.range.max`,
        )
      ) {
        return undefined;
      }
      range.max = axis.range.max;
    }
    result.range = range;
  }

  if (axis.steps !== undefined) {
    if (
      !validateNumber(
        axis.steps,
        ctx,
        'Random offset steps must be a number',
        `${axisName}.steps`,
      )
    ) {
      return undefined;
    }
    result.steps = axis.steps;
  }

  return result;
};

/**
 * Creates a random_offset component for Minecraft blocks
 */
export const createRandomOffset = (
  options?: RandomOffsetComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:random_offset': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const result: any = {};

  for (const axis of ['x', 'y', 'z'] as const) {
    const converted = convertAxis(options[axis], ctx, axis);
    if (converted === undefined && options[axis] !== undefined) {
      return undefined;
    }
    if (converted !== undefined) {
      result[axis] = converted;
    }
  }

  return {
    'minecraft:random_offset': result,
  };
};
