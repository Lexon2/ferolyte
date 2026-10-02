import { LocalizedString } from '@ferolyte/common/content/localization/localized-string';
import { Identifier, LooseString } from '@ferolyte/common/types';

import { ColorValue } from '../../../content/common/types/color-value';
import { ItemMenuCategory } from '../../item/interfaces/item-menu-category';
import { BlockTags } from '../components/tags';
import { Molang } from '../../molang';

import type {
  GeneratedBlockComponents,
} from '../../generated/block/components';
import type {
  ConnectionTrait,
  MultiBlockTrait,
  PlacementDirectionTrait,
  PlacementPositionTrait,
} from '../../generated/block/traits';

// The typed block components keep their pre-codegen names.
export type * from '../../generated/block/components';

// Interface for block states
export interface BlockStates {
  [key: string]:
    | string[]
    | { values: { min: number; max: number } }
    | number[]
    | boolean[];
}

// Interface for block traits (generated from the schemas; `states` / `yRotation` are SDK aliases)
/** A trait accepts `enabledStates` (schema name) or its SDK alias `states` — exactly one of the two. */
type WithStatesAlias<T extends { enabledStates?: unknown }, Extra = {}> =
  | (T & Extra)
  | (Omit<T, 'enabledStates'> & Extra & { states: T['enabledStates'] });

export interface BlockTraits {
  /**
   * Placement direction trait
   * @minecraft minecraft:placement_direction
   */
  placementDirection?: WithStatesAlias<
    PlacementDirectionTrait,
    {
      /** Alias of `yRotationOffset` (horizontal state values only). */
      yRotation?: 90 | 180 | 270 | -90 | -180 | -270;
    }
  >;

  /**
   * Placement position trait
   * @minecraft minecraft:placement_position
   */
  placementPosition?: WithStatesAlias<PlacementPositionTrait>;

  /**
   * Connection trait (fences, glass panes). Adds the
   * `minecraft:connection_{north,east,south,west}` states.
   * @minecraft minecraft:connection
   */
  connection?: WithStatesAlias<ConnectionTrait> | Record<string, never>;

  /**
   * Multi block trait (doors, beds). Treats several parts as a single block.
   * Cannot be combined with `connection` or `placementPosition`; a horizontal
   * direction also cannot be combined with `randomOffset`.
   * @minecraft minecraft:multi_block
   */
  multiBlock?: MultiBlockTrait;
}

// Interface for block permutation
export interface BlockPermutationConfig {
  /**
   * Condition describing when this permutation is applied
   */
  condition: BlockPermutationCondition;

  /**
   * Components for this permutation
   */
  components: BlockComponents;
}

export interface BlockPermutationCondition {
  /**
   * A Molang expression that evaluates to true or false.
   */
  query?: string | Molang;
  /**
   * Block States for this permutation
   */
  states?: {
    [key: string]: string[] | number[] | boolean[];
  };
}

// Block component types
export type Vector3 = [number, number, number];

export type TintMethod =
  | 'none'
  | 'default_foliage'
  | 'birch_foliage'
  | 'evergreen_foliage'
  | 'dry_foliage'
  | 'grass'
  | 'water';


// Interface for material instances component
export const enum MaterialInstanceFace {
  Up = 'up',
  Down = 'down',
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
  Side = 'side',
  All = '*',
}

export type BlockFilterDescriptor =
  | string
  | { tags: string }
  | {
      /**
       * A minecraft block identifier.
       * @minecraft name
       */
      name: string;
      /**
       * @minecraft states
       */
      states?: Record<string, boolean | number | string>;
      /**
       * Molang definition.
       * @minecraft tags
       */
      tags?: string;
    };

// Block components. Generated from the Bedrock schemas (`npm run codegen`);
// `tags`, `displayName` and `customComponents` accept SDK sugar (see `block/overrides.ts`).
export interface BlockComponents<Legacy extends boolean = false>
  extends Omit<GeneratedBlockComponents, 'tags' | 'displayName' | 'customComponents'> {
  /**
   * Custom components (`namespace:name`) registered in scripts. Emitted verbatim.
   */
  [customComponent: `${string}:${string}`]: unknown;

  /**
   * Custom component definitions
   * @description Used for legacy (version < 1.21.90) custom component keys.
   */
  customComponents?: Legacy extends true ? string[] : never;

  /**
   * Display name of the block. Converted to a language key automatically.
   * @minecraft minecraft:display_name
   */
  displayName?: LocalizedString;

  /**
   * Block tags (`tag:<name>` keys are generated)
   */
  tags?: (BlockTags | (string & {}))[];
}

export type BlockVersions =
  | '1.21.70'
  | '1.21.80'
  | '1.21.90'
  | '1.21.100'
  | '1.21.110'
  | '1.21.120'
  | '1.21.130'
  | '1.26.10'
  | '1.26.20'
  | '1.26.30'
  | '1.26.40'
  | '1.26.50';

/**
 * Main interface for block configuration
 */
export interface BlockConfig<
  Version extends LooseString<BlockVersions> = LooseString<BlockVersions>,
> {
  /**
   * Block version
   */
  version?: Version;
  /**
   * Block identifier
   * @example "minecraft:stone" or "example:my_block"
   */
  identifier: string;

  /**
   * Menu category for the block
   */
  menuCategory?: ItemMenuCategory;

  /**
   * Block states
   */
  states?: BlockStates;

  /**
   * Block traits
   */
  traits?: BlockTraits;

  /**
   * Block components
   */
  components?: BlockComponents<
    Version extends '1.21.70' | '1.21.80' ? true : false
  >;

  /**
   * Raw components
   * @description Escape hatch for components that have no typed entry yet. Merged into the output as is.
   * Not to be confused with `minecraft:custom_components`.
   */
  rawComponents?: Record<`${string}:${string}`, unknown>;

  /**
   * Block permutations based on states
   */
  permutations?: BlockPermutationConfig[];
}
