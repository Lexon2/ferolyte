import { LocalizedString } from '@ferolyte/common/content/localization/localized-string';
import { LooseString } from '@ferolyte/common/types';
import { EntityComponentGroup } from './entity-component-group';
import { EntityComponents } from './entity-components';
import { EntityEvents } from './entity-events';
import { EntityProperties } from './entity-properties';
import { SpawnCategory } from '../constants/spawn-category';
import { Molang } from '../../molang';

export type ServerEntityVersions =
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
 * Main configuration interface for Minecraft entities
 */
export interface ServerEntityConfig {
  /**
   * Entity Version
   * @description The version of the entity. This is used to determine the format of the entity data.
   * @default Takes the version from `ferolyte.config.ts` by default
   */
  version?: LooseString<ServerEntityVersions>;

  /**
   * Is Experimental
   * @description If this entity is experimental, it will only be registered if the world is marked as experimental.
   * @default false
   */
  isExperimental?: boolean;

  /**
   * Display Name
   * @description Name of the entity and of its spawn egg. A string uses the default locale,
   * a record maps locale codes to translations.
   * @file Automatically added to the `.lang` file(s) as `entity.<id>.name` and `item.spawn_egg.entity.<id>.name`.
   */
  displayName?: LocalizedString;

  /**
   * Is Spawnable
   * @description Sets whether or not this entity has a spawn egg in the creative ui.
   * @default false
   */
  isSpawnable?: boolean;

  /**
   * Is Summonable
   * @description Sets whether or not we can summon this entity using commands such as /summon.
   * @default true
   */
  isSummonable?: boolean;

  /**
   * Spawn Category
   * @description The category of the entity.
   * @default "misc"
   */
  spawnCategory?: SpawnCategory;

  /**
   * Runtime Identifier
   * @description Sets the name for the Vanilla Minecraft identifier this entity will use to build itself from.
   */
  runtimeIdentifier?: string;

  /**
   * Animations
   * @description Sets the mapping of internal animation / animation controllers references to actual animations. This is a JSON Object of name/animation pairs
   */
  animations?: {
    [key: string]: string;
  };

  /**
   * Scripts
   * @description Sets the mapping of internal animation controller references to actual animation controller. This is a JSON Array of name/animation-controller pairs
   */
  scripts?: {
    animate: (
      | {
          [key: string]: string | Molang;
        }
      | string
    )[];
  };

  /**
   * Entity Identifier
   * @description The identifier of the entity. This is used to determine the entity type.
   * It will also be used to determine the entity file name.
   * @example `minecraft:pig` -> `pig.entity.json`
   */
  // @TODO: Replace with Identifier type
  identifier: string;

  /**
   * Entity Properties
   * @description The properties of the entity.
   */
  properties?: EntityProperties;

  /**
   * Components
   * @description The components that are added as the foundation of the entity.
   */
  components?: EntityComponents;

  /**
   * Raw components
   * @description Escape hatch for components that have no typed entry yet. Merged into the output as is.
   * Not to be confused with `minecraft:custom_components`.
   */
  rawComponents?: Record<`${string}:${string}`, unknown>;

  /**
   * Component Groups
   * @description Each group when add / remove the default components.
   */
  componentGroups?: EntityComponentGroup[];

  /**
   * Events
   * @description The events that the entity can run, these add or remove components_groups.
   */
  events?: ServerEntityEvents;
}

export type ServerEntityEvents = {
  [key in MinecraftEvents | (string & {})]?: EntityEvents;
};

export type MinecraftEvents =
  | 'minecraft:entity_spawned'
  | 'minecraft:on_prime'
  | 'minecraft:entity_transformed'
  | 'minecraft:entity_born';
