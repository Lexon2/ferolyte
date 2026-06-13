import { itemComponentCreatorsFactory } from './convertors/components';
import { convertMenuCategory } from './convertors/components/menu-category/convert-category';
import { ItemConfig } from './interfaces/item-config';
import { MinecraftItem } from './interfaces/minecraft-item';
import { ContentBuilder } from '../../common/interfaces/content.builder';
import { CONTENT_METADATA } from '../../compiler/content/content.metadata';

export class ItemBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.ITEM;

  private config: ItemConfig;
  constructor(config: ItemConfig) {
    this.config = config;
  }

  public cloneConfig(): ItemConfig {
    return structuredClone(this.config);
  }

  public build(): MinecraftItem {
    const { config } = this;

    const item: MinecraftItem = {
      // @TODO: Add support for artifex config
      format_version: config.version || '1.21.70',
      'minecraft:item': {
        description: {
          identifier: config.identifier,
        },
      },
    };

    this.formatDescription(item);
    this.formatComponents(item);

    return item;
  }

  private formatDescription(item: MinecraftItem) {
    const { isExperimental, menuCategory } = this.config;
    const { description } = item['minecraft:item'];

    if (isExperimental !== undefined) {
      description.is_experimental = isExperimental;
    }

    const convertedMenuCategory = menuCategory
      ? convertMenuCategory(menuCategory)
      : undefined;

    if (convertedMenuCategory !== undefined) {
      description.menu_category = convertedMenuCategory;
    }
  }

  private formatComponents(item: MinecraftItem) {
    const { components } = this.config;

    if (components === undefined || Object.keys(components).length === 0) {
      return;
    }

    let itemComponents: MinecraftItem['minecraft:item']['components'] = {};

    for (const component in components) {
      const factory =
        itemComponentCreatorsFactory[
          component as keyof typeof itemComponentCreatorsFactory
        ];
      if (factory === undefined) {
        itemComponents = {
          ...itemComponents,
          [component]: components[component as keyof typeof components],
        };
        continue;
      }
      const componentData = components[component as keyof typeof components];

      const minecraftComponent = factory(componentData);
      if (minecraftComponent === undefined) {
        console.warn(`Item component "${component}" is invalid. Skipping...`);
        continue;
      }
      itemComponents = { ...itemComponents, ...minecraftComponent };
    }

    item['minecraft:item'].components = itemComponents;
  }
}
