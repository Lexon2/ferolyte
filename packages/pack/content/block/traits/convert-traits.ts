import { BlockComponents, BlockTraits } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import {
  logContentError,
  logContentWarning,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';
import { blockTraitRegistry } from '../../generated/block/registry';
import {
  convertGenerated,
  passthroughNormalizers,
} from '../../generated/runtime';
import { validateAllowedValue } from '@ferolyte/common/content/validation/content-validation';

const MULTI_BLOCK_DIRECTIONS = [
  'up',
  'down',
  'north',
  'east',
  'south',
  'west',
] as const;

const hasNWayVisualRotation = (components?: BlockComponents): boolean => {
  const geometry = components?.geometry;

  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    geometry.nWayVisualRotation !== undefined
  );
};

const convertMultiBlock = (
  traits: BlockTraits,
  components: BlockComponents | undefined,
  ctx?: ContentDiagnosticContext,
  formatVersion?: string,
): any => {
  const multiBlock = traits.multiBlock;
  if (multiBlock === undefined) {
    return undefined;
  }

  const field = (fieldPath: string) =>
    ctx !== undefined ? { ...ctx, fieldPath } : undefined;

  if (
    !validateAllowedValue(
      multiBlock.direction,
      MULTI_BLOCK_DIRECTIONS,
      field('multiBlock.direction'),
      'Multi block direction must be "up", "down", "north", "east", "south" or "west"',
    )
  ) {
    return undefined;
  }

  const enabledStates = multiBlock.enabledStates ?? [
    'minecraft:multi_block_part',
  ];
  if (
    !Array.isArray(enabledStates) ||
    enabledStates.length === 0 ||
    !enabledStates.every((state) => state === 'minecraft:multi_block_part')
  ) {
    logContentError(
      field('multiBlock.enabledStates'),
      'Multi block enabled states must be ["minecraft:multi_block_part"]',
    );
    return undefined;
  }

  let valid = true;

  if (multiBlock.parts !== undefined) {
    if (
      !Number.isInteger(multiBlock.parts) ||
      multiBlock.parts < 2 ||
      multiBlock.parts > 4
    ) {
      logContentError(
        field('multiBlock.parts'),
        'Multi block parts must be an integer between 2 and 4',
      );
      valid = false;
    }
  }

  if (traits.connection !== undefined) {
    logContentError(
      field('multiBlock'),
      'Multi block cannot be combined with the "connection" trait',
    );
    valid = false;
  }

  if (traits.placementPosition !== undefined) {
    logContentError(
      field('multiBlock'),
      'Multi block cannot be combined with the "placementPosition" trait',
    );
    valid = false;
  }

  const placementDirection = traits.placementDirection as
    | { states?: string[]; enabledStates?: string[] }
    | undefined;
  const placementStates =
    placementDirection?.states ?? placementDirection?.enabledStates;
  if (
    placementStates !== undefined &&
    !placementStates.every((state) => state === 'minecraft:cardinal_direction')
  ) {
    logContentError(
      field('placementDirection.states'),
      'With a multi block only "minecraft:cardinal_direction" is allowed in placementDirection',
    );
    valid = false;
  }

  if (hasNWayVisualRotation(components)) {
    logContentError(
      field('multiBlock'),
      'Multi block geometry must not use "nWayVisualRotation"',
    );
    valid = false;
  }

  if (!valid) {
    return undefined;
  }

  if (!['up', 'down'].includes(multiBlock.direction)) {
    if (components?.randomOffset !== undefined) {
      logContentError(
        field('multiBlock.direction'),
        'Multi block with a horizontal direction cannot be combined with the "randomOffset" component',
      );

      return undefined;
    }

    // Horizontal directions were released in format version 1.26.50.
    if (
      formatVersion === undefined ||
      !isVersionAtLeast(formatVersion, '1.26.50')
    ) {
      logContentWarning(
        field('multiBlock.direction'),
        `Multi block direction "${multiBlock.direction}" requires Upcoming Creator Features before format_version 1.26.50`,
      );
    }
  }

  const result: any = {
    enabled_states: enabledStates,
    direction: multiBlock.direction,
  };
  if (multiBlock.parts !== undefined) {
    result.parts = multiBlock.parts;
  }

  return result;
};

/** SDK aliases of trait fields (`states`, `yRotation`) → schema names. */
const prepareTrait = (
  trait: Record<string, unknown>,
  defaults: Record<string, unknown> = {},
): Record<string, unknown> => {
  const { states, yRotation, ...rest } = trait;

  return {
    ...defaults,
    ...rest,
    ...(states !== undefined && { enabledStates: states }),
    ...(yRotation !== undefined && { yRotationOffset: yRotation }),
  };
};

const TRAIT_KEYS = {
  placementDirection: {},
  placementPosition: {},
  connection: { enabledStates: ['minecraft:cardinal_connections'] },
} as const;

export const convertBlockTraits = (
  traits: BlockTraits,
  ctx?: ContentDiagnosticContext,
  components?: BlockComponents,
  formatVersion?: string,
): any => {
  if (traits === undefined || typeof traits !== 'object') {
    return undefined;
  }

  const minecraftTraits: any = {};

  for (const [key, defaults] of Object.entries(TRAIT_KEYS)) {
    const trait = (traits as Record<string, any>)[key];
    if (trait === undefined) {
      continue;
    }
    const entry = blockTraitRegistry[key];
    const traitContext: ContentDiagnosticContext | undefined =
      ctx !== undefined ? { ...ctx, fieldPath: key } : undefined;
    const converted = convertGenerated(
      entry,
      prepareTrait(trait, defaults as Record<string, unknown>),
      passthroughNormalizers,
      traitContext,
    );
    if (converted !== undefined) {
      Object.assign(minecraftTraits, converted);
    }
  }

  // Cross-trait rules of the multi block (Minecraft refuses such blocks).
  const multiBlock = convertMultiBlock(traits, components, ctx, formatVersion);
  if (multiBlock !== undefined) {
    minecraftTraits['minecraft:multi_block'] = multiBlock;
  }

  return minecraftTraits;
};
