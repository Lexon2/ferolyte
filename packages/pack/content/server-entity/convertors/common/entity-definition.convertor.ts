import {
  ContentDiagnosticContext,
  withFieldPath,
} from '../../../../common/diagnostics/content-diagnostic';
import { convertEntityFilters } from './filters.convertor';
import { validateBoolean, validateNumber } from './validation';
import { EntityDefinition, EntityTypes } from '../../types/entity-types';

export const convertEntityDefinition = (
  definitions: EntityTypes,
  ctx?: ContentDiagnosticContext,
): any[] | undefined => {
  if (!definitions) {
    return undefined;
  }
  if (Array.isArray(definitions)) {
    return definitions
      .map((definition, index) =>
        convertSingleEntityDefinition(
          definition,
          ctx !== undefined
            ? { ...ctx, fieldPath: `${ctx.fieldPath}[${index}]` }
            : undefined,
        ),
      )
      .filter((definition) => definition !== undefined);
  }
  return convertSingleEntityDefinition(definitions, ctx);
};

/**
 * Converts an EntityDefinition to Minecraft format
 * @param definition The entity definition to convert
 * @returns The entity definition in Minecraft format or undefined if validation fails
 */
export const convertSingleEntityDefinition = (
  definition: Partial<EntityDefinition>,
  ctx?: ContentDiagnosticContext,
): any | undefined => {
  if (!definition) {
    return undefined;
  }

  const result: any = {};

  if (definition.filters !== undefined) {
    const convertedFilters = convertEntityFilters(
      definition.filters,
      withFieldPath(ctx, 'filters'),
    );
    if (!convertedFilters) {
      return undefined;
    }
    result.filters = convertedFilters;
  }

  if (definition.cooldown !== undefined) {
    if (!validateNumber(definition.cooldown, 'cooldown', undefined, undefined, ctx)) {
      return undefined;
    }
    result.cooldown = definition.cooldown;
  }

  if (definition.maxDist !== undefined) {
    if (!validateNumber(definition.maxDist, 'maxDist', undefined, undefined, ctx)) {
      return undefined;
    }
    result.max_dist = definition.maxDist;
  }

  if (definition.maxHeight !== undefined) {
    if (!validateNumber(definition.maxHeight, 'maxHeight', undefined, undefined, ctx)) {
      return undefined;
    }
    result.max_height = definition.maxHeight;
  }

  if (definition.maxFlee !== undefined) {
    if (!validateNumber(definition.maxFlee, 'maxFlee', undefined, undefined, ctx)) {
      return undefined;
    }
    result.max_flee = definition.maxFlee;
  }

  if (definition.priority !== undefined) {
    if (!validateNumber(definition.priority, 'priority', undefined, undefined, ctx)) {
      return undefined;
    }
    result.priority = definition.priority;
  }

  if (definition.withinDefault !== undefined) {
    if (!validateNumber(definition.withinDefault, 'withinDefault', undefined, undefined, ctx)) {
      return undefined;
    }
    result.within_default = definition.withinDefault;
  }

  if (definition.checkIfOutnumbered !== undefined) {
    if (!validateBoolean(definition.checkIfOutnumbered, 'checkIfOutnumbered', ctx)) {
      return undefined;
    }
    result.check_if_outnumbered = definition.checkIfOutnumbered;
  }

  if (definition.mustSee !== undefined) {
    if (!validateBoolean(definition.mustSee, 'mustSee', ctx)) {
      return undefined;
    }
    result.must_see = definition.mustSee;
  }

  if (definition.mustSeeForgetDuration !== undefined) {
    if (!validateNumber(definition.mustSeeForgetDuration, 'mustSeeForgetDuration', undefined, undefined, ctx)) {
      return undefined;
    }
    result.must_see_forget_duration = definition.mustSeeForgetDuration;
  }

  if (definition.reevaluateDescription !== undefined) {
    if (!validateBoolean(definition.reevaluateDescription, 'reevaluateDescription', ctx)) {
      return undefined;
    }
    result.reevaluate_description = definition.reevaluateDescription;
  }

  if (definition.sprintSpeedMultiplier !== undefined) {
    if (!validateNumber(definition.sprintSpeedMultiplier, 'sprintSpeedMultiplier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.sprint_speed_multiplier = definition.sprintSpeedMultiplier;
  }

  if (definition.walkSpeedMultiplier !== undefined) {
    if (!validateNumber(definition.walkSpeedMultiplier, 'walkSpeedMultiplier', undefined, undefined, ctx)) {
      return undefined;
    }
    result.walk_speed_multiplier = definition.walkSpeedMultiplier;
  }

  return result;
};
