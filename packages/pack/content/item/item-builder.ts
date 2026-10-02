import {
  hintSnakeCaseComponent,
  hintSnakeCaseFields,
} from '@ferolyte/common/content/diagnostics/snake-case-hint';
import { itemComponentRegistry } from '../generated/item/registry';
import {
  convertWithOverride,
  passthroughNormalizers,
} from '../generated/runtime';
import { itemOverrides } from './overrides';
import { convertMenuCategory } from './convertors/components/menu-category/convert-category';
import { ItemConfig } from './interfaces/item-config';
import { MinecraftItem } from './interfaces/minecraft-item';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';

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
      // @TODO: Add support for ferolyte config
      format_version: config.version || '1.21.70',
      'minecraft:item': {
        description: {
          identifier: config.identifier,
        },
      },
    };

    this.formatDescription(item);
    this.formatComponents(item);
    this.validateHasComponents(item);

    return item;
  }

  /**
   * Since format version 1.26.30 an item without components is invalid.
   */
  private validateHasComponents(item: MinecraftItem) {
    const { version } = this.config;
    if (
      version === undefined ||
      !isVersionAtLeast(version, '1.26.30') ||
      Object.keys(item['minecraft:item'].components ?? {}).length > 0
    ) {
      return;
    }

    logContentError(
      this.buildContext !== undefined
        ? { ...this.buildContext, section: 'components' }
        : undefined,
      `Items with format_version ${version} must define at least one component`,
    );
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
    const { components = {}, rawComponents = {} } = this.config;

    if (
      Object.keys(components).length === 0 &&
      Object.keys(rawComponents).length === 0
    ) {
      return;
    }

    let itemComponents: MinecraftItem['minecraft:item']['components'] = {};

    for (const component in components) {
      const componentData = components[component as keyof typeof components];
      const componentContext: ContentDiagnosticContext = {
        contentType: 'item',
        ...this.buildContext,
        component,
        fieldPath: undefined,
        formatVersion:
          this.config.version || this.buildContext?.minGameVersion || undefined,
      };
      const generated = itemComponentRegistry[component];

      if (generated === undefined) {
        // Namespaced custom components pass through; unknown camelCase keys are reported.
        hintSnakeCaseComponent(
          component,
          (camel) => camel in itemComponentRegistry,
          componentContext,
        );
        if (component.includes(':')) {
          itemComponents = { ...itemComponents, [component]: componentData };
        } else {
          logContentError(
            componentContext,
            `Item component "${component}" is not supported`,
          );
        }
        continue;
      }

      const minecraftComponent = convertWithOverride(
        generated,
        componentData,
        passthroughNormalizers,
        componentContext,
        itemOverrides[component],
      );

      if (minecraftComponent === undefined) {
        continue;
      }

      itemComponents = { ...itemComponents, ...minecraftComponent };
    }

    item['minecraft:item'].components = {
      ...itemComponents,
      ...rawComponents,
    };
  }
}
