import { Identifier } from '@artifex/common/types';

import { ItemMenuCategory } from './item-menu-category';
import { DamageSourceType } from '../../../common/types/damage-source';
import { ItemTags } from '../types/item-tags';
import { ItemVersions } from '../types/item-versions';
import { ItemRepairableComponent } from './components/repairable';
import { ItemRarity } from '../types/item-rarity';
import { ItemDiggerComponent } from './components/digger';
import { ItemDurabilitySensorComponent } from './components/durability-sensor';
import { ItemEnchantableSlots } from '../types/item-enchantable-slots';
import { ItemHoverTextColor } from '../types/item-hover-text-color';
import { ItemRecordComponent } from './components/record';
import { ItemUseAnimation } from '../types/item-use-animation';
import { ItemWearableSlot } from '../types/item-wearable-slot';
import { ItemKineticWeaponComponent } from './components/kinetic-weapon';
import { ItemPiercingWeaponComponent } from './components/piercing-weapon';
import { ItemSwingSoundsComponent } from './components/swing-sounds';

export interface ItemComponents<Legacy extends boolean = false> {
  /**
   * Item Name
   * @description The name of the item. This is used to determine the display name of the item.
   * @file This filed will automatically be converted to a localized string and added to the `.lang` file(s).
   */
  displayName?: string;

  /**
   * Allow Off Hand
   * @description Determines if the item can be placed in off-hand slot
   * @default false
   */
  allowOffHand?: boolean;

  /**
   * Block Placer
   * @description Allows the item to place blocks when used
   */
  blockPlacer?: {
    // @TODO: Replace with Identifier type
    block: string;
    useOn?: string[];
    replaceBlockItem?: boolean;
    alignedPlacement?: boolean;
  };

  /**
   * Bundle Interaction
   * @description Adds bundle-specific interactions and tooltip to the item
   */
  bundleInteraction?: {
    numViewableSlots?: number;
  };

  /**
   * Can Destroy In Creative
   * @description Determines if the item can destroy blocks in creative mode
   * @default true
   */
  canDestroyInCreative?: boolean;

  /**
   * Compostable
   * @description Allows item to be placed in composter and defines chance to increase level
   */
  compostable?: {
    compostingChance?: number;
  };

  /**
   * Cooldown
   * @description Defines cooldown time after using the item
   */
  cooldown?: {
    category: string;
    duration: number;
    type?: 'use' | 'attack';
  };

  /**
   * Custom component definitions
   * @description Used for legacy (version < 1.21.90) custom component keys.
   */
  customComponents?: Legacy extends true ? string[] : never;

  /**
   * Damage
   * @description Defines damage values for the item
   */
  damage?: number;

  /**
   * Damage Absorption
   * @description Defines how much damage the item can absorb
   */
  damageAbsorption?: {
    causes: DamageSourceType[];
  };

  /**
   * Digger
   * @description Allows item to break blocks with specific efficiency
   */
  digger?: ItemDiggerComponent;

  /**
   * Durability
   * @description Defines how durable the item is (how many uses before breaking)
   */
  durability?: {
    maxDurability: number;
    damageChance?: {
      min: number;
      max: number;
    };
  };

  /**
   * Durability Sensor
   * @description Defines triggers based on item durability
   */
  durabilitySensor?: ItemDurabilitySensorComponent;

  /**
   * Dyeable
   * @description Allows the item to be dyed
   * @example `dyeable: { defaultColor: "#ff0000" }` will set the default color to red
   * @example `dyeable: { defaultColor: [255, 0, 0] }` will set the default color to red
   */
  dyeable?: {
    defaultColor?: `#${string}` | [number, number, number];
  };

  /**
   * Enchantable
   * @description Defines how the item can be enchanted
   */
  enchantable?: {
    slot: ItemEnchantableSlots;
    value?: number;
  };

  /**
   * Entity Placer
   * @description Allows the item to place entities when used
   */
  entityPlacer?: {
    entity: string;
    dispenseOn?: string[];
    useOn?: string[];
  };

  /**
   * Fire Resistant
   * @description Determines whether an item is immune to burning when dropped in fire or lava
   */
  fireResistant?: boolean;

  /**
   * Food
   * @description Defines food properties for the item
   */
  food?: {
    canAlwaysEat?: boolean;
    nutrition?: number;
    saturationModifier?: number;
    usingConvertsTo?: string;
  };

  /**
   * Fuel
   * @description Defines how the item can be used as fuel
   */
  fuel?: {
    duration: number;
  };

  /**
   * Glint
   * @description Determines if the item has an enchantment glint
   * @default false
   */
  glint?: boolean;

  /**
   * Hand Equipped
   * @description Determines if the item is rendered in hand when equipped
   * @default false
   */
  handEquipped?: boolean;

  /**
   * Hover Text Color
   * @description Determines the color of the item name when hovering over it
   */
  hoverTextColor?: ItemHoverTextColor;

  /**
   * Icon
   * @description Defines the icon for the item.
   *
   * By default creates link to the texture depending on item identifier and your `artifex.config.ts` settings.
   * For example, if you set `alias: "arfex_example"` in your config and the item identifier is `arfex:stone`,
   * the icon link will be `textures/arfex/example/items/stone.png`.
   * It also automatically adds the texture to the `item_textures.json` file.
   *
   * Example:
   *
   * ``` icon: "textures/items/stone.png" ``` - will set the icon to the stone texture.
   */
  icon?:
    | string
    | {
        textures: {
          default: string;
          [key: string]: string;
        };
      };

  /**
   * Interact Button
   * @description Determines if the interact button is shown in touch controls, and what text is displayed
   */
  interactButton?: boolean | string;

  /**
   * Kinetic Weapon
   * @description Allows an item to deal kinetic damage and its effects
   */
  kineticWeapon?: ItemKineticWeaponComponent;

  /**
   * Liquid Clipped
   * @description Determines if the item can be used in liquids
   * @default false
   */
  liquidClipped?: boolean;

  /**
   * Max Stack Size
   * @description Defines how many items can be stacked together
   * @default 1
   */
  maxStackSize?: number;

  /**
   * Piercing Weapon
   * @description Allows an item to deal damage to all entities in a straight line along the view vector
   */
  piercingWeapon?: ItemPiercingWeaponComponent;

  /**
   * Projectile
   * @description Defines projectile properties for the item
   */
  projectile?: {
    projectileEntity: string;
    minimumCriticalPower?: number;
  };

  /**
   * Record
   * @description Defines music record properties
   */
  record?: ItemRecordComponent;

  /**
   * Rarity
   * @description Defines the rarity of the item
   */
  rarity?: ItemRarity;

  /**
   * Repairable
   * @description Defines how the item can be repaired
   */
  repairable?: ItemRepairableComponent;

  /**
   * Shooter
   * @description Defines shooter properties for the item
   */
  shooter?: {
    ammunition?: Array<{
      item: string;
      useOffhand?: boolean;
      searchInventory?: boolean;
      useInCreative?: boolean;
    }>;
    chargeOnDraw?: boolean;
    maxDrawDuration?: number;
    scalePowerByDrawDuration?: boolean;
  };

  /**
   * Should Despawn
   * @description Determines if the item should despawn when dropped
   * @default true
   */
  shouldDespawn?: boolean;

  /**
   * Stacked By Data
   * @description Determines if items with different data values can stack together
   * @default false
   */
  stackedByData?: boolean;

  /**
   * Storage Item
   * @description Defines storage properties for the item
   */
  storageItem?: {
    allowNestedStorageItems?: boolean;
    allowedItems?: string[];
    bannedItems?: string[];
    maxSlots?: number;
  };

  /**
   * Storage Weight Limit
   * @description Defines weight limit for storage
   */
  storageWeightLimit?: {
    maxWeightLimit?: number;
  };

  /**
   * Storage Weight Modifier
   * @description Defines weight modifier for storage
   */
  storageWeightModifier?: {
    weightInStorageItem?: number;
  };

  /**
   * Swing Duration
   * @description Duration of the item's swing animation when mining or attacking
   */
  swingDuration?: {
    value?: number;
  };

  /**
   * Swing Sounds
   * @description Overrides the swing sounds emitted by the user
   */
  swingSounds?: ItemSwingSoundsComponent;

  /**
   * Tags
   * @description Defines tags for the item
   */
  tags?: ItemTags[];

  /**
   * Throwable
   * @description Defines throwable properties for the item
   */
  throwable?: {
    doSwingAnimation?: boolean;
    launchPowerScale?: number;
    maxDrawDuration?: number;
    minDrawDuration?: number;
    maxLaunchPower?: number;
    scalePowerByDrawDuration?: boolean;
  };

  /**
   * Use Animation
   * @description Defines the animation to play when using the item
   */
  useAnimation?: ItemUseAnimation;

  /**
   * Use Modifiers
   * @description Defines modifiers when using the item
   */
  useModifiers?: {
    useDuration: number;
    movementModifier?: number;
    emitVibrations?: boolean;
    startSound?: string;
  };

  /**
   * Wearable
   * @description Defines wearable properties for the item
   */
  wearable?: {
    protection?: number;
    dispensable?: boolean;
    slot?: ItemWearableSlot;
    hidesPlayerLocation?: boolean;
  };
}

export interface ItemConfig<Version extends ItemVersions = ItemVersions> {
  /**
   * Item Version
   * @description The version of the item. This is used to determine the format of the item data.
   * @default Takes the version from `artifex.config.ts` by default
   */
  version?: Version;

  /**
   * Item Identifier
   * @description The identifier of the item. This is used to determine the item type.
   * It will also be used to determine the item file name.
   * @example `minecraft:stone` -> `stone.item.json
   * @example `artifex:my_item` -> `my_item.item.json`
   */
  // @TODO: Replace with Identifier type
  identifier: string;

  /**
   * Item Menu Category
   * @description The menu category of the item.
   */
  menuCategory?: ItemMenuCategory;

  components?:
    | ItemComponents<Version extends '1.21.70' | '1.21.80' ? true : false>
    | Record<Identifier, any>;
}
