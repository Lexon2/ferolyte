import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { OffspringComponent } from '../../../interfaces/components/ai/offspring-component';
import {
  validateBoolean,
  validateNumber,
  validateString,
} from '../../common/validation';

/**
 * Converts an OffspringComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertOffspringComponent = (
  component: Partial<OffspringComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:offspring': Record<string, unknown> } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  if (component.blendAttributes !== undefined) {
    if (!validateBoolean(component.blendAttributes, 'blendAttributes', ctx)) {
      return undefined;
    }
    result.blend_attributes = component.blendAttributes;
  }

  if (component.denyParentsVariant !== undefined) {
    const validatedVariant: Record<string, number> = {};
    if (component.denyParentsVariant.chance !== undefined) {
      if (
        !validateNumber(
          component.denyParentsVariant.chance,
          'denyParentsVariant.chance',
          0,
          1,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedVariant.chance = component.denyParentsVariant.chance;
    }
    if (component.denyParentsVariant.maxVariant !== undefined) {
      if (
        !validateNumber(
          component.denyParentsVariant.maxVariant,
          'denyParentsVariant.maxVariant',
          0,
          Number.MAX_VALUE,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedVariant.max_variant = component.denyParentsVariant.maxVariant;
    }
    if (component.denyParentsVariant.minVariant !== undefined) {
      if (
        !validateNumber(
          component.denyParentsVariant.minVariant,
          'denyParentsVariant.minVariant',
          0,
          Number.MAX_VALUE,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedVariant.min_variant = component.denyParentsVariant.minVariant;
    }
    result.deny_parents_variant = validatedVariant;
  }

  if (component.mutationFactor !== undefined) {
    const validatedFactor: Record<string, number> = {};
    if (component.mutationFactor.color !== undefined) {
      if (
        !validateNumber(
          component.mutationFactor.color,
          'mutationFactor.color',
          0,
          1,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedFactor.color = component.mutationFactor.color;
    }
    if (component.mutationFactor.extraVariant !== undefined) {
      if (
        !validateNumber(
          component.mutationFactor.extraVariant,
          'mutationFactor.extraVariant',
          0,
          1,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedFactor.extra_variant = component.mutationFactor.extraVariant;
    }
    if (component.mutationFactor.variant !== undefined) {
      if (
        !validateNumber(
          component.mutationFactor.variant,
          'mutationFactor.variant',
          0,
          1,
          ctx,
        )
      ) {
        return undefined;
      }
      validatedFactor.variant = component.mutationFactor.variant;
    }
    result.mutation_factor = validatedFactor;
  }

  if (component.mutationStrategy !== undefined) {
    if (
      component.mutationStrategy !== 'random' &&
      component.mutationStrategy !== 'none'
    ) {
      return undefined;
    }
    result.mutation_strategy = component.mutationStrategy;
  }

  if (component.parentCentricAttributeBlending !== undefined) {
    const validatedAttributes = component.parentCentricAttributeBlending.map(
      (attr, index) => {
        if (
          !validateString(attr, `parentCentricAttributeBlending[${index}]`, ctx)
        ) {
          return undefined;
        }
        return attr;
      },
    );

    if (validatedAttributes.includes(undefined)) {
      return undefined;
    }

    result.parent_centric_attribute_blending = validatedAttributes;
  }

  if (component.propertyInheritance !== undefined) {
    const validatedProperties = component.propertyInheritance.map(
      (prop, index) => {
        const validatedProp: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(prop)) {
          if (
            !validateNumber(
              value.mutationChance,
              `propertyInheritance[${index}].${key}.mutationChance`,
              0,
              1,
              ctx,
            )
          ) {
            return undefined;
          }
          if (
            !Array.isArray(value.mutationValues) ||
            value.mutationValues.length === 0
          ) {
            return undefined;
          }
          validatedProp[key] = {
            mutation_chance: value.mutationChance,
            mutation_values: value.mutationValues,
          };
        }
        return validatedProp;
      },
    );

    if (validatedProperties.includes(undefined)) {
      return undefined;
    }

    result.property_inheritance = validatedProperties;
  }

  if (component.randomExtraVariantMutationInterval !== undefined) {
    if (
      !Array.isArray(component.randomExtraVariantMutationInterval) ||
      component.randomExtraVariantMutationInterval.length !== 2
    ) {
      return undefined;
    }
    if (
      !validateNumber(
        component.randomExtraVariantMutationInterval[0],
        'randomExtraVariantMutationInterval[0]',
        0,
        Number.MAX_VALUE,
        ctx,
      ) ||
      !validateNumber(
        component.randomExtraVariantMutationInterval[1],
        'randomExtraVariantMutationInterval[1]',
        0,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.random_extra_variant_mutation_interval =
      component.randomExtraVariantMutationInterval;
  }

  if (component.randomVariantMutationInterval !== undefined) {
    if (
      !Array.isArray(component.randomVariantMutationInterval) ||
      component.randomVariantMutationInterval.length !== 2
    ) {
      return undefined;
    }
    if (
      !validateNumber(
        component.randomVariantMutationInterval[0],
        'randomVariantMutationInterval[0]',
        0,
        Number.MAX_VALUE,
        ctx,
      ) ||
      !validateNumber(
        component.randomVariantMutationInterval[1],
        'randomVariantMutationInterval[1]',
        0,
        Number.MAX_VALUE,
        ctx,
      )
    ) {
      return undefined;
    }
    result.random_variant_mutation_interval =
      component.randomVariantMutationInterval;
  }

  if (component.inheritTamed !== undefined) {
    if (!validateBoolean(component.inheritTamed, 'inheritTamed', ctx)) {
      return undefined;
    }
    result.inherit_tamed = component.inheritTamed;
  }

  if (component.combineParentColors !== undefined) {
    if (
      !validateBoolean(
        component.combineParentColors,
        'combineParentColors',
        ctx,
      )
    ) {
      return undefined;
    }
    result.combine_parent_colors = component.combineParentColors;
  }

  if (component.offspringPairs !== undefined) {
    const validatedPairs: Record<string, string> = {};
    for (const [key, value] of Object.entries(component.offspringPairs)) {
      if (!validateString(value, `offspringPairs.${key}`, ctx)) {
        return undefined;
      }
      validatedPairs[key] = value;
    }
    result.offspring_pairs = validatedPairs;
  }

  return {
    'minecraft:offspring': result,
  };
};
