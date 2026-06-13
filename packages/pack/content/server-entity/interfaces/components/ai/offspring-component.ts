/**
 * Interface for the offspring component
 * Defines how an offspring of an entity is born.
 */
export interface OffspringComponent {
  /**
   * If true, the entities will blend their attributes in the offspring after they breed.
   * @default true
   */
  blendAttributes?: boolean;

  /**
   * Determines how likely the baby of parents with the same variant will deny that variant.
   */
  denyParentsVariant?: {
    chance?: number;
    maxVariant?: number;
    minVariant?: number;
  };

  /**
   * Determines how likely the babies are to NOT inherit one of their parent's variances.
   */
  mutationFactor?: {
    color?: number;
    extraVariant?: number;
    variant?: number;
  };

  /**
   * Strategy used for mutating variants and extra variants for offspring.
   * @default "none"
   */
  mutationStrategy?: 'random' | 'none';

  /**
   * List of attributes that should benefit from parent centric attribute blending.
   */
  parentCentricAttributeBlending?: string[];

  /**
   * List of Entity Properties that should be inherited from the parent entities and potentially mutated.
   */
  propertyInheritance?: Array<{
    [propertyName: string]: {
      mutationChance: number;
      mutationValues: unknown[];
    };
  }>;

  /**
   * Range used to determine random extra variant.
   * @default 0
   */
  randomExtraVariantMutationInterval?: [number, number];

  /**
   * Range used to determine random variant.
   * @default 0
   */
  randomVariantMutationInterval?: [number, number];

  /**
   * If true, the babies will be automatically tamed if its parents are.
   * @default true
   */
  inheritTamed?: boolean;

  /**
   * If true, the babies will have their color be mixed.
   * @default true
   */
  combineParentColors?: boolean;

  /**
   * Key-value pair of the other entity and the offspring to spawn.
   */
  offspringPairs?: Record<string, string>;
}
