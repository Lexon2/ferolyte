import { itemComponentCreatorsFactory } from './convertors/components';
import { ItemComponentCreator } from './convertors/components/index';
import { convertMenuCategory } from './convertors/components/menu-category/convert-category';
import { ItemConfig } from './interfaces/item-config';
import { MinecraftItem } from './interfaces/minecraft-item';
import { ContentBuilder } from '@artifex/common/content/interfaces/content-builder';
import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { CONTENT_METADATA } from '@artifex/common/content/metadata';

export class ItemBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.ITEM;

  private config: ItemConfig;
  private buildContext?: ContentDiagnosticContext;

  constructor(config: ItemConfig) {
    this.config = config;
  }

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = { contentType: 'item', ...ctx };
    return this;
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

    const menuCategoryContext: ContentDiagnosticContext | undefined =
      this.buildContext !== undefined
        ? { ...this.buildContext, component: 'menuCategory' }
        : undefined;

    const convertedMenuCategory = menuCategory
      ? convertMenuCategory(menuCategory, menuCategoryContext)
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
        ] as ItemComponentCreator | undefined;

      if (factory === undefined) {
        itemComponents = {
          ...itemComponents,
          [component]: components[component as keyof typeof components],
        };
        continue;
      }

      const componentData = components[component as keyof typeof components];
      const componentContext: ContentDiagnosticContext | undefined =
        this.buildContext !== undefined
          ? { ...this.buildContext, component, fieldPath: undefined }
          : undefined;

      const minecraftComponent = factory(componentData, componentContext);
      if (minecraftComponent === undefined) {
        continue;
      }

      itemComponents = { ...itemComponents, ...minecraftComponent };
    }

    item['minecraft:item'].components = itemComponents;
  }
}
