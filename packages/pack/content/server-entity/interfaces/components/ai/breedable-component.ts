import { EntityFilters } from '../../filters';
import { EntityEventTrigger } from '../../trigger';

/**
 * Interface for the breedable component
 * Defines the way an entity can get into the `love` state
 */
export interface BreedableComponent {
  /**
   * If true, entities can breed while sitting
   * @default false
   */
  allowSitting?: boolean;

  /**
   * If true, the entities will blend their attributes in the offspring after they breed
   * @default true
   */
  blendAttributes?: boolean;

  /**
   * Time in seconds before the Entity can breed again
   * @default 60.0
   */
  breedCooldown?: number;

  /**
   * The list of items that can be used to get the entity into the `love` state
   */
  breedItems?: string | string[];

  /**
   * The list of entity definitions that this entity can breed with
   */
  breedsWith?: BreedsWithSpec | BreedsWithSpec[];

  /**
   * If true, the entity will become pregnant instead of spawning a baby
   * @default false
   */
  causesPregnancy?: boolean;

  /**
   * Determines how likely the baby of parents with the same variant will deny that variant and take a random variant within the given range instead
   */
  denyParentsVariant?: {
    /**
     * The percentage chance of denying the parents' variant
     * @default 0
     */
    chance?: number;
    /**
     * The inclusive maximum of the variant range
     * @default 0
     */
    maxVariant?: number;
    /**
     * The inclusive minimum of the variant range
     * @default 0
     */
    minVariant?: number;
  };

  /**
   * The list of nearby block requirements to get the entity into the `love` state
   */
  environmentRequirements?: EnvironmentRequirements | EnvironmentRequirements[];

  /**
   * Chance that up to 16 babies will spawn between 0.0 and 1.0, where 1.0 is 100%
   * @default 0.0
   */
  extraBabyChance?: number;

  /**
   * The filters to run when attempting to fall in love
   */
  loveFilters?: EntityFilters;

  /**
   * Determines how likely the babies are to NOT inherit one of their parent's variances
   */
  mutationFactor?: {
    /**
     * The percentage chance of the offspring getting its color as if spawned rather than inheriting color from its parents
     * @default 0
     */
    color?: number;
    /**
     * The percentage chance of a mutation on the entity's extra variant type
     * @default 0
     */
    extraVariant?: number;
    /**
     * The percentage chance of a mutation on the entity's variant type
     * @default 0
     */
    variant?: number;
  };

  /**
   * Strategy used for mutating variants and extra variants for offspring
   * @default "none"
   */
  mutationStrategy?: 'random' | 'none';

  /**
   * List of attributes that should benefit from parent centric attribute blending
   */
  parentCentricAttributeBlending?: string[];

  /**
   * List of Entity Properties that should be inherited from the parent entities and potentially mutated
   */
  propertyInheritance?: Array<{
    [propertyName: string]: {
      /**
       * The chance it should not inherit from either parent
       */
      mutationChance: number;
      /**
       * Array of values to select from if mutating and the component has random mutation set
       */
      mutationValues: any[];
    };
  }>;

  /**
   * Range used to determine random extra variant
   * @default 0
   */
  randomExtraVariantMutationInterval?: [number, number];

  /**
   * Range used to determine random variant
   * @default 0
   */
  randomVariantMutationInterval?: [number, number];

  /**
   * If true, the babies will be automatically tamed if its parents are
   * @default true
   */
  inheritTamed?: boolean;

  /**
   * If true, the babies will have their color be mixed
   * @default true
   */
  combineParentColors?: boolean;

  /**
   * If true, the entity needs to be at full health before it can breed
   * @default false
   */
  requireFullHealth?: boolean;

  /**
   * If true, the entities need to be tamed first before they can breed
   * @default true
   */
  requireTame?: boolean;

  /**
   * The feed item used will transform to this item upon successful interaction
   */
  transformToItem?: string;
}

/**
 * Interface for breeds with specification
 */
export interface BreedsWithSpec {
  /**
   * The entity definition of this entity's babies
   */
  babyType?: string;
  /**
   * Event to run when this entity breeds
   */
  breedEvent?: EntityEventTrigger;
  /**
   * The entity definition of this entity's mate
   */
  mateType?: string;
}

/**
 * Interface for environment requirements
 */
export interface EnvironmentRequirements {
  /**
   * The block types required nearby for the entity to breed
   */
  blocks?: string | string[];
  /**
   * The number of the required block types nearby for the entity to breed
   */
  count?: number;
  /**
   * How many blocks radius from the mob's center to search in for the required blocks
   */
  radius?: number;
}
