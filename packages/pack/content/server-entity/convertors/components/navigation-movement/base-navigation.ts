import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BaseNavigation } from '../../../interfaces/components/navigation-movement/base-navigation';
import { validateBoolean } from '../../common/validation';
import { validateStringArray } from '../../common/validation';

/**
 * Converts base navigation properties to Minecraft format
 * @param navigation The navigation properties to convert
 * @returns The navigation properties in Minecraft format or undefined if validation fails
 */
export const convertBaseNavigation = (
  navigation: Partial<BaseNavigation>,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!navigation) {
    return undefined;
  }

  const result: any = {};

  // Validate avoidDamageBlocks
  if (navigation.avoidDamageBlocks !== undefined) {
    if (!validateBoolean(navigation.avoidDamageBlocks, 'avoidDamageBlocks')) {
      return undefined;
    }
    result.avoid_damage_blocks = navigation.avoidDamageBlocks;
  }

  // Validate avoidPortals
  if (navigation.avoidPortals !== undefined) {
    if (!validateBoolean(navigation.avoidPortals, 'avoidPortals')) {
      return undefined;
    }
    result.avoid_portals = navigation.avoidPortals;
  }

  // Validate avoidSun
  if (navigation.avoidSun !== undefined) {
    if (!validateBoolean(navigation.avoidSun, 'avoidSun')) {
      return undefined;
    }
    result.avoid_sun = navigation.avoidSun;
  }

  // Validate avoidWater
  if (navigation.avoidWater !== undefined) {
    if (!validateBoolean(navigation.avoidWater, 'avoidWater')) {
      return undefined;
    }
    result.avoid_water = navigation.avoidWater;
  }

  // Validate blocksToAvoid
  if (navigation.blocksToAvoid !== undefined) {
    if (!validateStringArray(navigation.blocksToAvoid, 'blocksToAvoid')) {
      return undefined;
    }
    result.blocks_to_avoid = navigation.blocksToAvoid;
  }

  // Validate canBreach
  if (navigation.canBreach !== undefined) {
    if (!validateBoolean(navigation.canBreach, 'canBreach')) {
      return undefined;
    }
    result.can_breach = navigation.canBreach;
  }

  // Validate canBreakDoors
  if (navigation.canBreakDoors !== undefined) {
    if (!validateBoolean(navigation.canBreakDoors, 'canBreakDoors')) {
      return undefined;
    }
    result.can_break_doors = navigation.canBreakDoors;
  }

  // Validate canJump
  if (navigation.canJump !== undefined) {
    if (!validateBoolean(navigation.canJump, 'canJump')) {
      return undefined;
    }
    result.can_jump = navigation.canJump;
  }

  // Validate canOpenDoors
  if (navigation.canOpenDoors !== undefined) {
    if (!validateBoolean(navigation.canOpenDoors, 'canOpenDoors')) {
      return undefined;
    }
    result.can_open_doors = navigation.canOpenDoors;
  }

  // Validate canOpenIronDoors
  if (navigation.canOpenIronDoors !== undefined) {
    if (!validateBoolean(navigation.canOpenIronDoors, 'canOpenIronDoors')) {
      return undefined;
    }
    result.can_open_iron_doors = navigation.canOpenIronDoors;
  }

  // Validate canPassDoors
  if (navigation.canPassDoors !== undefined) {
    if (!validateBoolean(navigation.canPassDoors, 'canPassDoors')) {
      return undefined;
    }
    result.can_pass_doors = navigation.canPassDoors;
  }

  // Validate canPathFromAir
  if (navigation.canPathFromAir !== undefined) {
    if (!validateBoolean(navigation.canPathFromAir, 'canPathFromAir')) {
      return undefined;
    }
    result.can_path_from_air = navigation.canPathFromAir;
  }

  // Validate canPathOverLava
  if (navigation.canPathOverLava !== undefined) {
    if (!validateBoolean(navigation.canPathOverLava, 'canPathOverLava')) {
      return undefined;
    }
    result.can_path_over_lava = navigation.canPathOverLava;
  }

  // Validate canPathOverWater
  if (navigation.canPathOverWater !== undefined) {
    if (!validateBoolean(navigation.canPathOverWater, 'canPathOverWater')) {
      return undefined;
    }
    result.can_path_over_water = navigation.canPathOverWater;
  }

  // Validate canSink
  if (navigation.canSink !== undefined) {
    if (!validateBoolean(navigation.canSink, 'canSink')) {
      return undefined;
    }
    result.can_sink = navigation.canSink;
  }

  // Validate canSwim
  if (navigation.canSwim !== undefined) {
    if (!validateBoolean(navigation.canSwim, 'canSwim')) {
      return undefined;
    }
    result.can_swim = navigation.canSwim;
  }

  // Validate canWalk
  if (navigation.canWalk !== undefined) {
    if (!validateBoolean(navigation.canWalk, 'canWalk')) {
      return undefined;
    }
    result.can_walk = navigation.canWalk;
  }

  // Validate canWalkInLava
  if (navigation.canWalkInLava !== undefined) {
    if (!validateBoolean(navigation.canWalkInLava, 'canWalkInLava')) {
      return undefined;
    }
    result.can_walk_in_lava = navigation.canWalkInLava;
  }

  // Validate isAmphibious
  if (navigation.isAmphibious !== undefined) {
    if (!validateBoolean(navigation.isAmphibious, 'isAmphibious')) {
      return undefined;
    }
    result.is_amphibious = navigation.isAmphibious;
  }

  return result;
};
