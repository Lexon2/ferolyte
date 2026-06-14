import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BreedableComponent, BreedsWithSpec, EnvironmentRequirements } from '../../../interfaces/components/ai/breedable-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a breeds with specification
 * @param spec The specification to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the specification is valid
 */
const validateBreedsWithSpec = (
  spec: BreedsWithSpec,
  fieldName: string,
): boolean => {
  if (spec.babyType !== undefined && !validateString(spec.babyType, `${fieldName}.babyType`)) {
    return false;
  }

  if (spec.mateType !== undefined && !validateString(spec.mateType, `${fieldName}.mateType`)) {
    return false;
  }

  // breedEvent is a Trigger type that is validated elsewhere
  return true;
};

/**
 * Validates environment requirements
 * @param requirements The requirements to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the requirements are valid
 */
const validateEnvironmentRequirements = (
  requirements: EnvironmentRequirements,
  fieldName: string,
): boolean => {
  if (requirements.blocks !== undefined) {
    if (typeof requirements.blocks === 'string') {
      if (!validateString(requirements.blocks, `${fieldName}.blocks`)) {
        return false;
      }
    } else if (Array.isArray(requirements.blocks)) {
      const validatedBlocks = requirements.blocks.map((block, index) => {
        if (!validateString(block, `${fieldName}.blocks[${index}]`)) {
          return undefined;
        }
        return block;
      });

      if (validatedBlocks.includes(undefined)) {
        return false;
      }
    } else {
      console.error(`${fieldName}.blocks must be a string or array of strings`);

      return false;
    }
  }

  if (requirements.count !== undefined) {
    if (!validateNumber(requirements.count, `${fieldName}.count`, 0, Number.MAX_VALUE)) {
      return false;
    }
  }

  if (requirements.radius !== undefined) {
    if (!validateNumber(requirements.radius, `${fieldName}.radius`, 0, 16)) {
      return false;
    }
  }

  return true;
};

/**
 * Converts a BreedableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBreedableComponent = (
  component: Partial<BreedableComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:breedable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate allowSitting
  if (component.allowSitting !== undefined) {
    if (typeof component.allowSitting !== 'boolean') {
      console.error('allowSitting must be a boolean');

      return undefined;
    }
    result.allow_sitting = component.allowSitting;
  }

  // Validate blendAttributes
  if (component.blendAttributes !== undefined) {
    if (typeof component.blendAttributes !== 'boolean') {
      console.error('blendAttributes must be a boolean');

      return undefined;
    }
    result.blend_attributes = component.blendAttributes;
  }

  // Validate breedCooldown
  if (component.breedCooldown !== undefined) {
    if (!validateNumber(component.breedCooldown, 'breedCooldown', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.breed_cooldown = component.breedCooldown;
  }

  // Validate breedItems
  if (component.breedItems !== undefined) {
    if (typeof component.breedItems === 'string') {
      if (!validateString(component.breedItems, 'breedItems')) {
        return undefined;
      }
      result.breed_items = component.breedItems;
    } else if (Array.isArray(component.breedItems)) {
      const validatedItems = component.breedItems.map((item, index) => {
        if (!validateString(item, `breedItems[${index}]`)) {
          return undefined;
        }
        return item;
      });

      if (validatedItems.includes(undefined)) {
        return undefined;
      }

      result.breed_items = validatedItems;
    } else {
      console.error('breedItems must be a string or array of strings');

      return undefined;
    }
  }

  // Validate breedsWith
  if (component.breedsWith !== undefined) {
    if (Array.isArray(component.breedsWith)) {
      const validatedSpecs = component.breedsWith.map((spec, index) => {
        if (!validateBreedsWithSpec(spec, `breedsWith[${index}]`)) {
          return undefined;
        }

        const validatedSpec: any = {};
        if (spec.babyType !== undefined) {
          validatedSpec.baby_type = spec.babyType;
        }
        if (spec.breedEvent !== undefined) {
          validatedSpec.breed_event = spec.breedEvent;
        }
        if (spec.mateType !== undefined) {
          validatedSpec.mate_type = spec.mateType;
        }
        return validatedSpec;
      });

      if (validatedSpecs.includes(undefined)) {
        return undefined;
      }

      result.breeds_with = validatedSpecs;
    } else {
      if (!validateBreedsWithSpec(component.breedsWith, 'breedsWith')) {
        return undefined;
      }

      const validatedSpec: any = {};
      if (component.breedsWith.babyType !== undefined) {
        validatedSpec.baby_type = component.breedsWith.babyType;
      }
      if (component.breedsWith.breedEvent !== undefined) {
        validatedSpec.breed_event = component.breedsWith.breedEvent;
      }
      if (component.breedsWith.mateType !== undefined) {
        validatedSpec.mate_type = component.breedsWith.mateType;
      }
      result.breeds_with = validatedSpec;
    }
  }

  // Validate causesPregnancy
  if (component.causesPregnancy !== undefined) {
    if (typeof component.causesPregnancy !== 'boolean') {
      console.error('causesPregnancy must be a boolean');

      return undefined;
    }
    result.causes_pregnancy = component.causesPregnancy;
  }

  // Validate denyParentsVariant
  if (component.denyParentsVariant !== undefined) {
    const validatedVariant: any = {};
    if (component.denyParentsVariant.chance !== undefined) {
      if (!validateNumber(component.denyParentsVariant.chance, 'denyParentsVariant.chance', 0, 1)) {
        return undefined;
      }
      validatedVariant.chance = component.denyParentsVariant.chance;
    }
    if (component.denyParentsVariant.maxVariant !== undefined) {
      if (!validateNumber(component.denyParentsVariant.maxVariant, 'denyParentsVariant.maxVariant', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      validatedVariant.max_variant = component.denyParentsVariant.maxVariant;
    }
    if (component.denyParentsVariant.minVariant !== undefined) {
      if (!validateNumber(component.denyParentsVariant.minVariant, 'denyParentsVariant.minVariant', 0, Number.MAX_VALUE)) {
        return undefined;
      }
      validatedVariant.min_variant = component.denyParentsVariant.minVariant;
    }
    result.deny_parents_variant = validatedVariant;
  }

  // Validate environmentRequirements
  if (component.environmentRequirements !== undefined) {
    if (Array.isArray(component.environmentRequirements)) {
      const validatedRequirements = component.environmentRequirements.map((req, index) => {
        if (!validateEnvironmentRequirements(req, `environmentRequirements[${index}]`)) {
          return undefined;
        }

        const validatedReq: any = {};
        if (req.blocks !== undefined) {
          validatedReq.blocks = req.blocks;
        }
        if (req.count !== undefined) {
          validatedReq.count = req.count;
        }
        if (req.radius !== undefined) {
          validatedReq.radius = req.radius;
        }
        return validatedReq;
      });

      if (validatedRequirements.includes(undefined)) {
        return undefined;
      }

      result.environment_requirements = validatedRequirements;
    } else {
      if (!validateEnvironmentRequirements(component.environmentRequirements, 'environmentRequirements')) {
        return undefined;
      }

      const validatedReq: any = {};
      if (component.environmentRequirements.blocks !== undefined) {
        validatedReq.blocks = component.environmentRequirements.blocks;
      }
      if (component.environmentRequirements.count !== undefined) {
        validatedReq.count = component.environmentRequirements.count;
      }
      if (component.environmentRequirements.radius !== undefined) {
        validatedReq.radius = component.environmentRequirements.radius;
      }
      result.environment_requirements = validatedReq;
    }
  }

  // Validate extraBabyChance
  if (component.extraBabyChance !== undefined) {
    if (!validateNumber(component.extraBabyChance, 'extraBabyChance', 0, 1)) {
      return undefined;
    }
    result.extra_baby_chance = component.extraBabyChance;
  }

  // Validate loveFilters
  if (component.loveFilters !== undefined) {
    // Filters are validated elsewhere
    result.love_filters = component.loveFilters;
  }

  // Validate mutationFactor
  if (component.mutationFactor !== undefined) {
    const validatedFactor: any = {};
    if (component.mutationFactor.color !== undefined) {
      if (!validateNumber(component.mutationFactor.color, 'mutationFactor.color', 0, 1)) {
        return undefined;
      }
      validatedFactor.color = component.mutationFactor.color;
    }
    if (component.mutationFactor.extraVariant !== undefined) {
      if (!validateNumber(component.mutationFactor.extraVariant, 'mutationFactor.extraVariant', 0, 1)) {
        return undefined;
      }
      validatedFactor.extra_variant = component.mutationFactor.extraVariant;
    }
    if (component.mutationFactor.variant !== undefined) {
      if (!validateNumber(component.mutationFactor.variant, 'mutationFactor.variant', 0, 1)) {
        return undefined;
      }
      validatedFactor.variant = component.mutationFactor.variant;
    }
    result.mutation_factor = validatedFactor;
  }

  // Validate mutationStrategy
  if (component.mutationStrategy !== undefined) {
    if (component.mutationStrategy !== 'random' && component.mutationStrategy !== 'none') {
      console.error('mutationStrategy must be either "random" or "none"');

      return undefined;
    }
    result.mutation_strategy = component.mutationStrategy;
  }

  // Validate parentCentricAttributeBlending
  if (component.parentCentricAttributeBlending !== undefined) {
    if (!Array.isArray(component.parentCentricAttributeBlending)) {
      console.error('parentCentricAttributeBlending must be an array');

      return undefined;
    }

    const validatedAttributes = component.parentCentricAttributeBlending.map((attr, index) => {
      if (!validateString(attr, `parentCentricAttributeBlending[${index}]`)) {
        return undefined;
      }
      return attr;
    });

    if (validatedAttributes.includes(undefined)) {
      return undefined;
    }

    result.parent_centric_attribute_blending = validatedAttributes;
  }

  // Validate propertyInheritance
  if (component.propertyInheritance !== undefined) {
    if (!Array.isArray(component.propertyInheritance)) {
      console.error('propertyInheritance must be an array');

      return undefined;
    }

    const validatedProperties = component.propertyInheritance.map((prop, index) => {
      const validatedProp: any = {};
      for (const [key, value] of Object.entries(prop)) {
        if (!validateNumber(value.mutationChance, `propertyInheritance[${index}].${key}.mutationChance`, 0, 1)) {
          return undefined;
        }
        if (!Array.isArray(value.mutationValues) || value.mutationValues.length === 0) {
          console.error(`propertyInheritance[${index}].${key}.mutationValues must be a non-empty array`);

          return undefined;
        }
        validatedProp[key] = {
          mutation_chance: value.mutationChance,
          mutation_values: value.mutationValues,
        };
      }

      return validatedProp;
    });

    if (validatedProperties.includes(undefined)) {
      return undefined;
    }

    result.property_inheritance = validatedProperties;
  }

  // Validate randomExtraVariantMutationInterval
  if (component.randomExtraVariantMutationInterval !== undefined) {
    if (!Array.isArray(component.randomExtraVariantMutationInterval) || component.randomExtraVariantMutationInterval.length !== 2) {
      console.error('randomExtraVariantMutationInterval must be an array of two numbers');

      return undefined;
    }
    if (!validateNumber(component.randomExtraVariantMutationInterval[0], 'randomExtraVariantMutationInterval[0]', 0, Number.MAX_VALUE) ||
        !validateNumber(component.randomExtraVariantMutationInterval[1], 'randomExtraVariantMutationInterval[1]', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.random_extra_variant_mutation_interval = component.randomExtraVariantMutationInterval;
  }

  // Validate randomVariantMutationInterval
  if (component.randomVariantMutationInterval !== undefined) {
    if (!Array.isArray(component.randomVariantMutationInterval) || component.randomVariantMutationInterval.length !== 2) {
      console.error('randomVariantMutationInterval must be an array of two numbers');

      return undefined;
    }
    if (!validateNumber(component.randomVariantMutationInterval[0], 'randomVariantMutationInterval[0]', 0, Number.MAX_VALUE) ||
        !validateNumber(component.randomVariantMutationInterval[1], 'randomVariantMutationInterval[1]', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.random_variant_mutation_interval = component.randomVariantMutationInterval;
  }

  // Validate inheritTamed
  if (component.inheritTamed !== undefined) {
    if (typeof component.inheritTamed !== 'boolean') {
      console.error('inheritTamed must be a boolean');

      return undefined;
    }
    result.inherit_tamed = component.inheritTamed;
  }

  // Validate combineParentColors
  if (component.combineParentColors !== undefined) {
    if (typeof component.combineParentColors !== 'boolean') {
      console.error('combineParentColors must be a boolean');

      return undefined;
    }
    result.combine_parent_colors = component.combineParentColors;
  }

  // Validate requireFullHealth
  if (component.requireFullHealth !== undefined) {
    if (typeof component.requireFullHealth !== 'boolean') {
      console.error('requireFullHealth must be a boolean');

      return undefined;
    }
    result.require_full_health = component.requireFullHealth;
  }

  // Validate requireTame
  if (component.requireTame !== undefined) {
    if (typeof component.requireTame !== 'boolean') {
      console.error('requireTame must be a boolean');

      return undefined;
    }
    result.require_tame = component.requireTame;
  }

  // Validate transformToItem
  if (component.transformToItem !== undefined) {
    if (!validateString(component.transformToItem, 'transformToItem')) {
      return undefined;
    }
    result.transform_to_item = component.transformToItem;
  }

  return {
    'minecraft:breedable': result,
  };
};
