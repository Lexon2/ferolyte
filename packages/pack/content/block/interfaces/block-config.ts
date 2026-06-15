import { Identifier } from '@ferolyte/common/types';

import { ColorValue } from '../../../content/common/types/color-value';
import { ItemMenuCategory } from '../../item/interfaces/item-menu-category';
import { BlockTags } from '../components/tags';
import { Molang } from '../../molang';

// Interface for block states
export interface BlockStates {
  [key: string]:
    | string[]
    | { values: { min: number; max: number } }
    | number[]
    | boolean[];
}

// Interface for block traits
export interface BlockTraits {
  /**
   * Placement direction trait
   */
  placementDirection?: {
    states?: ('minecraft:cardinal_direction' | 'minecraft:facing_direction')[];
    yRotation?: 90 | 180 | 270 | -90 | -180 | -270;
  };

  /**
   * Placement position trait
   */
  placementPosition?: {
    states?: ('minecraft:block_face' | 'minecraft:vertical_half')[];
  };
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

// Interface for collision box component
export interface CollisionBoxComponent {
  origin?: Vector3;
  size?: Vector3;
}

// Interface for crafting table component
export interface CraftingTableComponent {
  craftingTags?: string[];
  tableName?: string;
}

// Interface for destructible by explosion component
export interface DestructibleByExplosionComponent {
  /**
   * Describes how resistant the block is to explosion. Greater values mean the block is less likely to break when near an explosion (or has higher resistance to explosions). The scale will be different for different explosion power levels. A negative value or 0 means it will easily explode; larger numbers increase level of resistance.
   */
  explosionResistance?: number;
}

// Interface for destructible by mining component
export interface DestructibleByMiningComponent {
  secondsToDestroy?: number;
  itemSpecificSpeeds?: Array<{
    item: string | { tags: string };
    destroySpeed: number;
  }>;
}

export type TintMethod =
  | 'none'
  | 'default_foliage'
  | 'birch_foliage'
  | 'evergreen_foliage'
  | 'dry_foliage'
  | 'grass'
  | 'water';

// Interface for destruction particles component
export interface DestructionParticlesComponent {
  texture?: string;
  tintMethod?: TintMethod;
  particleCount?: number;
}

// Interface for flammable component
export interface FlammableComponent {
  catchChanceModifier?: number;
  destroyChanceModifier?: number;
}

// Interface for geometry component
export interface GeometryComponent {
  identifier: string;
  boneVisibility?: Record<string, boolean | string>;
  culling?: string;
  cullingLayer?: string;
  cullingShape?: string;
  uvLock?: boolean | string[];
}

// Interface for item visual component
export interface ItemVisualComponent {
  geometry: string | GeometryComponent;
  materialInstances: MaterialInstancesComponent;
}

export type EmbeddedVisualComponent = ItemVisualComponent;

// Interface for liquid detection component
export interface LiquidDetectionComponent {
  detectionRules?: Array<{
    canContainLiquid?: boolean;
    liquidType?: 'water';
    onLiquidTouches?: 'blocking' | 'broken' | 'popped' | 'no_reaction';
    stopsLiquidFlowingFromDirection?: Array<
      'up' | 'down' | 'north' | 'south' | 'east' | 'west' | 'side' | 'all'
    >;
    useLiquidClipping?: boolean;
  }>;
}

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

export type MaterialInstancesComponent = {
  [face in MaterialInstanceFace | (string & {})]?:
    | string
    | {
        ambientOcclusion?: boolean | number;
        faceDimming?: boolean;
        renderMethod?:
          | 'opaque'
          | 'double_sided'
          | 'blend'
          | 'alpha_test'
          | 'alpha_test_single_sided'
          | 'blend_to_opaque'
          | 'alpha_test_to_opaque'
          | 'alpha_test_single_sided_to_opaque';
        texture?: string;
        isotropic?: boolean;
        tintMethod?: TintMethod;
        alphaMaskedTint?: boolean;
      };
};

export type BlockFilterDescriptor =
  | string
  | { tags: string }
  | {
      name: string;
      states?: Record<string, boolean | number | string>;
      tags?: string;
    };

// Interface for placement filter component
export interface PlacementFilterComponent {
  conditions?: Array<{
    allowedFaces?: Array<
      'up' | 'down' | 'north' | 'south' | 'east' | 'west' | 'side' | 'all'
    >;
    blockFilter?: BlockFilterDescriptor[];
  }>;
}

// Interface for redstone conductivity component
export interface RedstoneConductivityComponent {
  allowsWireToStepDown?: boolean;
  redstoneConductor?: boolean;
}

// Interface for selection box component
export interface SelectionBoxComponent {
  origin?: Vector3;
  size?: Vector3;
}

// Interface for transformation component
export interface TransformationComponent {
  rotation?: Vector3;
  scale?: Vector3;
  translation?: Vector3;
  scalePivot?: Vector3;
  rotationPivot?: Vector3;
}

// Interface for tick component
export interface TickComponent {
  looping?: boolean;
  intervalRange?: [number, number];
}

// Interface for entity fall on component
export interface EntityFallOnComponent {
  minFallDistance?: number;
}

export interface ChestObstructionComponent {
  obstructionRule?: 'always' | 'never' | 'shape';
}

export interface ConnectionRuleComponent {
  acceptsConnectionsFrom?: 'all' | 'none' | 'only_fences';
  enabledDirections?: Array<'east' | 'north' | 'south' | 'west'>;
}

export interface LeashableComponent {
  offset?: Vector3;
}

export interface MovableComponent {
  movementType: 'push_pull' | 'push' | 'popped' | 'immovable';
  sticky?: 'same' | 'none';
}

export interface PrecipitationInteractionsComponent {
  precipitationBehavior:
    | 'obstruct_rain'
    | 'obstruct_rain_accumulate_snow'
    | 'none'
    | 'snow_log_no_collision';
}

export interface RandomOffsetAxis {
  range?: { min?: number; max?: number };
  steps?: number;
}

export interface RandomOffsetComponent {
  x?: RandomOffsetAxis;
  y?: RandomOffsetAxis;
  z?: RandomOffsetAxis;
}

export interface RedstoneConsumerComponent {
  minPower: number;
  propagatesPower?: boolean;
}

export interface RedstoneProducerComponent {
  power: number;
  stronglyPoweredFace?: Array<
    'up' | 'down' | 'north' | 'south' | 'east' | 'west' | 'side' | 'all'
  >;
  connectedFaces?: Array<
    'up' | 'down' | 'north' | 'south' | 'east' | 'west' | 'side' | 'all'
  >;
  transformRelative?: boolean;
}

export interface SupportComponent {
  shape: 'fence' | 'stair';
}

export type MapColorComponent =
  | ColorValue
  | { color: ColorValue; tintMethod?: string };

// Main block components interface
export interface BlockComponents<Legacy extends boolean = false> {
  /**
   * Collision box for the block
   */
  collisionBox?: boolean | CollisionBoxComponent | CollisionBoxComponent[];

  /**
   * Chest obstruction rule
   */
  chestObstruction?: ChestObstructionComponent;

  /**
   * Makes block into a custom crafting table
   */
  craftingTable?: CraftingTableComponent;

  /**
   * Connection rule for fences, walls, etc.
   */
  connectionRule?: ConnectionRuleComponent;

  /**
   * Custom component definitions
   * @description Used for legacy (version < 1.21.90) custom component keys.
   */
  customComponents?: Legacy extends true ? string[] : never;

  /**
   * Destructible by explosion properties
   */
  destructibleByExplosion?: boolean | DestructibleByExplosionComponent;

  /**
   * Destructible by mining properties
   */
  destructibleByMining?: boolean | DestructibleByMiningComponent;

  /**
   * Particles shown when the block is destroyed
   */
  destructionParticles?: DestructionParticlesComponent;

  /**
   * Display name of the block
   */
  displayName?: string;

  /**
   * Visual when embedded in another block (e.g. flowerpot)
   */
  embeddedVisual?: EmbeddedVisualComponent;

  /**
   * Flammable properties
   */
  flammable?: boolean | FlammableComponent;

  /**
   * Allows embedding in a flowerpot
   */
  flowerPottable?: boolean;

  /**
   * Friction value for the block (0.0-0.9)
   */
  friction?: number;

  /**
   * Geometry for the block
   */
  geometry?: string | GeometryComponent;

  /**
   * Item visual properties
   */
  itemVisual?: ItemVisualComponent;

  /**
   * Leash attachment offset
   */
  leashable?: LeashableComponent;

  /**
   * Light dampening value (0-15)
   */
  lightDampening?: number;

  /**
   * Light emission value (0-15)
   */
  lightEmission?: number;

  /**
   * Liquid detection properties
   */
  liquidDetection?: LiquidDetectionComponent;

  /**
   * Path to the loot table
   */
  loot?: string;

  /**
   * Color on maps
   */
  mapColor?: MapColorComponent;

  /**
   * Material instances for faces
   */
  materialInstances?: MaterialInstancesComponent;

  /**
   * Piston movement behavior
   */
  movable?: MovableComponent;

  /**
   * Placement filter conditions
   */
  placementFilter?: PlacementFilterComponent;

  /**
   * Rain and snow interaction behavior
   */
  precipitationInteractions?: PrecipitationInteractionsComponent;

  /**
   * Random position offset like foliage
   */
  randomOffset?: RandomOffsetComponent;

  /**
   * Redstone conductivity properties
   */
  redstoneConductivity?: RedstoneConductivityComponent;

  /**
   * Redstone signal consumer
   */
  redstoneConsumer?: RedstoneConsumerComponent;

  /**
   * Redstone signal producer
   */
  redstoneProducer?: RedstoneProducerComponent;

  /**
   * Block can be replaced when another block is placed
   */
  replaceable?: boolean;

  /**
   * Selection box for the block
   */
  selectionBox?: boolean | SelectionBoxComponent;

  /**
   * Support shape (fence, stair)
   */
  support?: SupportComponent;

  /**
   * Tick component properties
   */
  tick?: TickComponent;

  /**
   * Transformation properties
   */
  transformation?: TransformationComponent;

  /**
   * Block tags
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
  | '1.26.20';

/**
 * Main interface for block configuration
 */
export interface BlockConfig<Version extends BlockVersions = BlockVersions> {
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
  components?:
    | BlockComponents<Version extends '1.21.70' | '1.21.80' ? true : false>
    | Record<Identifier, any>;

  /**
   * Block permutations based on states
   */
  permutations?: BlockPermutationConfig[];
}
