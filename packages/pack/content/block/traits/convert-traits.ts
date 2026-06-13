import { BlockTraits } from '../interfaces/block-config';

export const convertBlockTraits = (traits: BlockTraits): any => {
  if (traits === undefined || typeof traits !== 'object') {
    return undefined;
  }

  const minecraftTraits: any = {};

  const validPlacementDirectionStates = [
    'minecraft:cardinal_direction',
    'minecraft:facing_direction',
  ];
  const validPlacementDirectionYRotations = [90, 180, 270, -90, -180, -270, 0];
  const validPlacementPositionStates = [
    'minecraft:block_face',
    'minecraft:vertical_half',
  ];

  if (traits.placementDirection) {
    const { states, yRotation } = traits.placementDirection;
    if (
      states &&
      Array.isArray(states) &&
      states.every((state) => validPlacementDirectionStates.includes(state))
    ) {
      minecraftTraits['minecraft:placement_direction'] = {
        enabled_states: states,
        y_rotation_offset:
          yRotation && validPlacementDirectionYRotations.includes(yRotation)
            ? yRotation
            : undefined,
      };
    }
  }

  if (traits.placementPosition) {
    const { states } = traits.placementPosition;
    if (
      states &&
      Array.isArray(states) &&
      states.every((state) => validPlacementPositionStates.includes(state))
    ) {
      minecraftTraits['minecraft:placement_position'] = {
        enabled_states: states,
      };
    }
  }

  return minecraftTraits;
};
