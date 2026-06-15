import { RedstoneProducerComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  validateAllowedValue,
  validateBooleanValue,
  validateIntegerRange,
} from '@ferolyte/common/content/validation/content-validation';

type Face =
  | 'up'
  | 'down'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'side'
  | 'all';

const VALID_FACES: Face[] = [
  'up',
  'down',
  'north',
  'south',
  'east',
  'west',
  'side',
  'all',
];

const convertFaces = (
  faces: Face[] | undefined,
  ctx: ContentDiagnosticContext | undefined,
  fieldPath: string,
): Face[] | undefined => {
  if (faces === undefined) {
    return undefined;
  }

  for (let index = 0; index < faces.length; index++) {
    const face = faces[index];
    if (
      !validateAllowedValue(
        face,
        VALID_FACES,
        ctx,
        'Face must be a valid direction value',
        `${fieldPath}[${index}]`,
      )
    ) {
      return undefined;
    }
  }

  return faces;
};

/**
 * Creates a redstone_producer component for Minecraft blocks
 */
export const createRedstoneProducer = (
  options?: RedstoneProducerComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:redstone_producer': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    !validateIntegerRange(
      options.power,
      0,
      15,
      ctx,
      'Power must be a number between 0 and 15',
      'power',
    )
  ) {
    return undefined;
  }

  const result: any = {
    power: options.power,
  };

  const stronglyPoweredFace = convertFaces(
    options.stronglyPoweredFace,
    ctx,
    'stronglyPoweredFace',
  );
  if (stronglyPoweredFace === undefined && options.stronglyPoweredFace) {
    return undefined;
  }
  if (stronglyPoweredFace !== undefined) {
    result.strongly_powered_face = stronglyPoweredFace;
  }

  const connectedFaces = convertFaces(
    options.connectedFaces,
    ctx,
    'connectedFaces',
  );
  if (connectedFaces === undefined && options.connectedFaces) {
    return undefined;
  }
  if (connectedFaces !== undefined) {
    result.connected_faces = connectedFaces;
  }

  if (options.transformRelative !== undefined) {
    if (
      !validateBooleanValue(
        options.transformRelative,
        ctx,
        'Transform relative must be a boolean',
        'transformRelative',
      )
    ) {
      return undefined;
    }
    result.transform_relative = options.transformRelative;
  }

  return {
    'minecraft:redstone_producer': result,
  };
};
