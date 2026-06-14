import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the genetics component
 * Defines the way a mob's genes and alleles are passed on to it's offspring, and how those traits manifest in the child.
 */
export interface GeneticsComponent {
  /**
   * Chance that an allele will be replaced with a random one instead of the parent's allele during birth
   * @default 0.03125
   */
  mutationRate?: number;

  /**
   * The list of genes that this entity has and will cross with a partner during breeding
   */
  genes?: Array<GeneticsGene>;
}

export interface GeneticsGene {
  /**
   * The range of positive integer allele values for this gene
   * Spawned mobs will have a random number in this range assigned to them
   */
  alleleRange?: number | { rangeMin: number; rangeMax: number };

  /**
   * The list of genetic variants for this gene
   * These check for particular allele combinations and fire events when all of them are satisfied
   */
  geneticVariants?: Array<GeneticVariant>;

  /**
   * The name of the gene
   */
  name?: string;
}

/**
 * Interface for a genetic variant
 * These check for particular allele combinations and fire events when all of them are satisfied
 */
export interface GeneticVariant {
  /**
   * Event to run when this mob is created and matches the above allele conditions
   */
  birthEvent?: EntityEventTrigger;

  /**
   * If this value is non-negative, compare both the mob's main and hidden alleles with this value for a match with both
   * Can also be a range of integers
   * @default -1
   */
  bothAllele?:
    | number
    | {
        rangeMin: number;
        rangeMax: number;
      };

  /**
   * If this value is non-negative, compare both the mob's main and hidden alleles with this value for a match with either
   * Can also be a range of integers
   * @default -1
   */
  eitherAllele?: number;

  /**
   * If this value is non-negative, compare the mob's hidden allele with this value for a match
   * Can also be a range of integers
   * @default -1
   */
  hiddenAllele?: number;

  /**
   * If this value is non-negative, compare the mob's main allele with this value for a match
   * Can also be a range of integers
   * @default -1
   */
  mainAllele?:
    | number
    | {
        rangeMin: number;
        rangeMax: number;
      };

  /**
   * If this value is non-negative, overrides the chance for this gene that an allele will be replaced with a random one instead of the parent's allele during birth
   * Non-negative values greater than 1 will be the same as the value 1
   * @default -1
   */
  mutationRate?: number;
}
