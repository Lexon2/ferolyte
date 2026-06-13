import { ItemMenuCategoryGroup } from '../types/item-menu-category-groups';

/**
 * Interface representing a Minecraft item in the game's format
 */
export interface MinecraftItem {
  format_version: string;
  'minecraft:item': {
    description: {
      identifier: string;
      is_experimental?: boolean;
      menu_category?: {
        group?: ItemMenuCategoryGroup;
        category?: 'construction' | 'equipment' | 'items' | 'nature' | 'none';
        is_hidden_in_commands?: boolean;
      };
    };

    /**
     * The components of this item.
     */
    components?: {
      'minecraft:allow_off_hand'?: boolean;
      'minecraft:block_placer'?: any;
      'minecraft:bundle_interaction'?: any;
      'minecraft:can_destroy_in_creative'?: any;
      'minecraft:compostable'?: any;
      'minecraft:cooldown'?: any;
      'minecraft:custom_components'?: any;
      'minecraft:damage'?: any;
      'minecraft:damage_absorption'?: any;
      'minecraft:digger'?: any;
      'minecraft:display_name'?: any;
      'minecraft:durability_sensor'?: any;
      'minecraft:durability'?: any;
      'minecraft:dyeable'?: any;
      'minecraft:enchantable'?: any;
      'minecraft:entity_placer'?: any;
      'minecraft:fire_resistant'?: any;
      'minecraft:food'?: any;
      'minecraft:fuel'?: any;
      'minecraft:glint'?: any;
      'minecraft:hand_equipped'?: any;
      'minecraft:icon'?: any;
      'minecraft:interact_button'?: any;
      'minecraft:kinetic_weapon'?: any;
      'minecraft:liquid_clipped'?: any;
      'minecraft:max_stack_size'?: any;
      'minecraft:piercing_weapon'?: any;
      'minecraft:projectile'?: any;
      'minecraft:record'?: any;
      'minecraft:rarity'?: any;
      'minecraft:repairable'?: any;
      'minecraft:shooter'?: any;
      'minecraft:should_despawn'?: any;
      'minecraft:stacked_by_data'?: any;
      'minecraft:storage_item'?: any;
      'minecraft:storage_weight_limit'?: any;
      'minecraft:storage_weight_modifier'?: any;
      'minecraft:swing_duration'?: any;
      'minecraft:swing_sounds'?: any;
      'minecraft:tags'?: any;
      'minecraft:throwable'?: any;
      'minecraft:use_animation'?: any;
      'minecraft:use_modifiers'?: any;
      'minecraft:wearable'?: any;
    };
  };
}
