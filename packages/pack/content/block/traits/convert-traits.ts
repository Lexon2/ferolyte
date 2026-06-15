import { BlockTraits } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { logContentError } from '@ferolyte/common/content/diagnostics/content-diagnostic';

export const convertBlockTraits = (
  traits: BlockTraits,
  ctx?: ContentDiagnosticContext,
): any => {
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
      if (
        yRotation !== undefined &&
        !validPlacementDirectionYRotations.includes(yRotation)
      ) {
        logContentError(
          ctx !== undefined
            ? { ...ctx, fieldPath: 'placementDirection.yRotation' }
            : undefined,
          'Placement direction yRotation must be a valid rotation value',
        );
      }

      minecraftTraits['minecraft:placement_direction'] = {
        enabled_states: states,
        y_rotation_offset:
          yRotation && validPlacementDirectionYRotations.includes(yRotation)
            ? yRotation
            : undefined,
      };
    } else if (states) {
      logContentError(
        ctx !== undefined
          ? { ...ctx, fieldPath: 'placementDirection.states' }
          : undefined,
        'Placement direction states must be valid enabled states',
      );
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
    } else if (states) {
      logContentError(
        ctx !== undefined
          ? { ...ctx, fieldPath: 'placementPosition.states' }
          : undefined,
        'Placement position states must be valid enabled states',
      );
    }
  }

  return minecraftTraits;
};
