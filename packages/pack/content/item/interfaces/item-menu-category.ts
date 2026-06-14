import { ItemMenuCategoryGroup } from '../types/item-menu-category-groups';
import { ItemMenuCategoryType } from '../types/item-menu-category-type';

export interface ItemMenuCategory {
  /**
   * Item Menu Category
   * @description The category of the item menu category. This is used to determine the category of the item in the menu.
   */
  category: ItemMenuCategoryType;
  /**
   * Item Menu Group
   * @description The group of the item menu category. This is used to determine the group of the item in the menu.
   */
  group?: ItemMenuCategoryGroup;
  /**
   * Shall the item be hidden in commands?
   */
  isHiddenInCommands?: boolean;
}
