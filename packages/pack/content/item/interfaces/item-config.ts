import type {
  GeneratedItemComponents,
  IconComponent,
  TagsComponent,
} from '../../generated/item/components';
import { LocalizedString } from '@ferolyte/common/content/localization/localized-string';
import { ItemMenuCategory } from './item-menu-category';
import { DamageSourceType } from '@ferolyte/common/content/types/damage-source';
import { ItemTags } from '../types/item-tags';
import { LooseString } from '@ferolyte/common/types';
import { ItemVersions } from '../types/item-versions';
import { ItemRarity } from '../types/item-rarity';
import { ItemEnchantableSlots } from '../types/item-enchantable-slots';
import { ItemHoverTextColor } from '../types/item-hover-text-color';
import { ItemUseAnimation } from '../types/item-use-animation';
import { ItemWearableSlot } from '../types/item-wearable-slot';

/**
 * Item components. Generated from the Bedrock schemas (`npm run codegen`);
 * `icon` and `displayName` accept SDK sugar (see `item/overrides.ts`).
 */
export interface ItemComponents<Legacy extends boolean = false>
  extends Omit<GeneratedItemComponents, 'icon' | 'displayName' | 'tags'> {
  /**
   * Custom components (`namespace:name`), e.g. block/item custom components registered in scripts.
   * Emitted verbatim. Typed vanilla components use camelCase keys.
   */
  [customComponent: `${string}:${string}`]: unknown;

  /**
   * Item icon: an `item_texture.json` key, or an object with several textures.
   * @minecraft minecraft:icon
   */
  icon?: string | IconComponent;

  /**
   * Item tags: a list, or the schema form `{ tags: [...] }`.
   * @minecraft minecraft:tags
   */
  tags?: string[] | TagsComponent;

  /**
   * Item name. Converted to a language key and added to the `.lang` file(s) automatically.
   * @minecraft minecraft:display_name
   */
  displayName?: LocalizedString;
}

export interface ItemConfig<
  Version extends LooseString<ItemVersions> = LooseString<ItemVersions>,
> {
  /**
   * Item Version
   * @description The version of the item. This is used to determine the format of the item data.
   * @default Takes the version from `ferolyte.config.ts` by default
   */
  version?: Version;

  /**
   * Item Identifier
   * @description The identifier of the item. This is used to determine the item type.
   * It will also be used to determine the item file name.
   * @example `minecraft:stone` -> `stone.item.json
   * @example `ferolyte:my_item` -> `my_item.item.json`
   */
  // @TODO: Replace with Identifier type
  identifier: string;

  /**
   * Item Menu Category
   * @description The menu category of the item.
   */
  menuCategory?: ItemMenuCategory;

  /**
   * Experimental flag
   * @description Emitted as `description.is_experimental` of the item.
   */
  isExperimental?: boolean;

  components?: ItemComponents<
    Version extends '1.21.70' | '1.21.80' ? true : false
  >;

  /**
   * Raw components
   * @description Escape hatch for components that have no typed entry yet. Merged into the output as is.
   * Not to be confused with `minecraft:custom_components`.
   */
  rawComponents?: Record<`${string}:${string}`, unknown>;
}
