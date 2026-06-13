import { RedstoneProducerComponent } from '../interfaces/block-config';

type Face =
  | 'up'
  | 'down'
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'side'
  | 'all';

const validFaces: Face[] = [
  'up',
  'down',
  'north',
  'south',
  'east',
  'west',
  'side',
  'all',
];

const convertFaces = (faces?: Face[]): Face[] | undefined => {
  if (faces === undefined) {
    return undefined;
  }

  for (const face of faces) {
    if (!validFaces.includes(face)) {
      console.error('Face must be a valid direction value');

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
): { 'minecraft:redstone_producer': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  if (
    typeof options.power !== 'number' ||
    options.power < 0 ||
    options.power > 15
  ) {
    console.error('Power must be a number between 0 and 15');

    return undefined;
  }

  const result: any = {
    power: options.power,
  };

  const stronglyPoweredFace = convertFaces(options.stronglyPoweredFace);
  if (stronglyPoweredFace === undefined && options.stronglyPoweredFace) {
    return undefined;
  }
  if (stronglyPoweredFace !== undefined) {
    result.strongly_powered_face = stronglyPoweredFace;
  }

  const connectedFaces = convertFaces(options.connectedFaces);
  if (connectedFaces === undefined && options.connectedFaces) {
    return undefined;
  }
  if (connectedFaces !== undefined) {
    result.connected_faces = connectedFaces;
  }

  if (options.transformRelative !== undefined) {
    if (typeof options.transformRelative !== 'boolean') {
      console.error('Transform relative must be a boolean');

      return undefined;
    }
    result.transform_relative = options.transformRelative;
  }

  return {
    'minecraft:redstone_producer': result,
  };
};
