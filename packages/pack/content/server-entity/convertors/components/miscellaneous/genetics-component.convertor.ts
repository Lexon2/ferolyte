import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { GeneticsComponent, GeneticsGene, GeneticVariant } from '../../../interfaces/components/miscellaneous/genetics-component';
import { convertRange } from '../../common/convertors';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a genetic variant
 * @param variant The variant to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the variant is valid
 */
const convertGeneticVariant = (
  variant: Partial<GeneticVariant>,
  fieldName: string,
): any => {
  if (!variant) {
    return undefined;
  }

  const result: any = {};

  // Validate birthEvent
  if (variant.birthEvent !== undefined) {
    const convertedBirthEvent = convertTrigger(variant.birthEvent, withFieldPath(ctx, 'birthEvent'));
    if (!convertedBirthEvent) {
      return undefined;
    }
    result.birth_event = convertedBirthEvent;
  }

  // Validate bothAllele
  if (variant.bothAllele !== undefined) {
    const convertedBothAllele = convertRange(variant.bothAllele, `${fieldName}.bothAllele`);
    if (!convertedBothAllele) {
      return undefined;
    }
    result.both_allele = convertedBothAllele;
  }

  // Validate eitherAllele
  if (variant.eitherAllele !== undefined) {
    if (!validateNumber(variant.eitherAllele, `${fieldName}.eitherAllele`, 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.either_allele = variant.eitherAllele;
  }

  // Validate hiddenAllele
  if (variant.hiddenAllele !== undefined) {
    if (!validateNumber(variant.hiddenAllele, `${fieldName}.hiddenAllele`, -1, Number.MAX_VALUE)) {
      return undefined;
    }
    result.hidden_allele = variant.hiddenAllele;
  }

  // Validate mainAllele
  if (variant.mainAllele !== undefined) {
    const convertedMainAllele = convertRange(variant.mainAllele, `${fieldName}.mainAllele`);
    if (!convertedMainAllele) {
      return undefined;
    }
    result.main_allele = convertedMainAllele;
  }

  // Validate mutationRate
  if (variant.mutationRate !== undefined) {
    if (!validateNumber(variant.mutationRate, `${fieldName}.mutationRate`, -1, 1)) {
      return undefined;
    }
    result.mutation_rate = variant.mutationRate;
  }

  return result;
};

/**
 * Validates a gene
 * @param gene The gene to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the gene is valid
 */
const convertGene = (
  gene: Partial<GeneticsGene>,
  fieldName: string,
): any => {
  if (!gene) {
    return undefined;
  }

  const result: any = {};

  // Validate alleleRange
  if (gene.alleleRange !== undefined) {
    const convertedAlleleRange = convertRange(gene.alleleRange, `${fieldName}.alleleRange`);
    if (!convertedAlleleRange) {
      return undefined;
    }
    result.allele_range = convertedAlleleRange;
  }

  // Validate geneticVariants
  if (gene.geneticVariants !== undefined) {
    if (!Array.isArray(gene.geneticVariants)) {
      console.error(`${fieldName}.geneticVariants must be an array`);

      return undefined;
    }
    result.genetic_variants = [];

    for (let i = 0; i < gene.geneticVariants.length; i++) {
      const convertedVariant = convertGeneticVariant(gene.geneticVariants[i], `${fieldName}.geneticVariants[${i}]`);
      if (!convertedVariant) {
        return undefined;
      }
      result.genetic_variants.push(convertedVariant);
    }
  }

  // Validate name
  if (gene.name !== undefined) {
    if (!validateString(gene.name, `${fieldName}.name`)) {
      return undefined;
    }
    result.name = gene.name;
  }

  return result;
};

/**
 * Converts a GeneticsComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertGeneticsComponent = (
  component: Partial<GeneticsComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:genetics': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate mutationRate
  if (component.mutationRate !== undefined) {
    if (!validateNumber(component.mutationRate, 'mutationRate', 0, 1)) {
      return undefined;
    }
    result.mutation_rate = component.mutationRate;
  }

  // Validate genes
  if (component.genes !== undefined) {
    if (!Array.isArray(component.genes)) {
      console.error('genes must be an array');

      return undefined;
    }
    result.genes = [];
    for (let i = 0; i < component.genes.length; i++) {
      const convertedGene = convertGene(component.genes[i], `genes[${i}]`);
      if (!convertedGene) {
        return undefined;
      }
      result.genes.push(convertedGene);
    }
  }

  return {
    'minecraft:genetics': result,
  };
};
