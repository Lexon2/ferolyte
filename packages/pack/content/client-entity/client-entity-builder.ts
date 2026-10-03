import { cloneConfig } from '@ferolyte/common/object/clone-config';
import { ClientEntityConfig } from './interfaces/client-entity-config';
import { ClientEntityAnimationResolver } from './interfaces/animations-collection';
import { formatRenderDescription } from '../render-description/render-description';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';

export class ClientEntityBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.CLIENT_ENTITY;

  private config: ClientEntityConfig;

  private animationResolver?: ClientEntityAnimationResolver;

  constructor(config: ClientEntityConfig) {
    this.config = config;
  }

  /**
   * Installs the resolver that turns animations with options into derived ids.
   */
  public withAnimationResolver(resolver: ClientEntityAnimationResolver): this {
    this.animationResolver = resolver;
    return this;
  }

  public cloneConfig(): ClientEntityConfig {
    return cloneConfig(this.config);
  }

  public build(): any {
    const { config } = this;

    const description: Record<string, any> = {
      identifier: config.identifier,
    };
    // Shared with attachables: geometry / textures / materials / animations / scripts / render controllers.
    formatRenderDescription(
      config as never,
      description,
      this.animationResolver,
    );
    this.formatEntityFields(description);

    return {
      format_version: config.version || '1.10.0',
      'minecraft:client_entity': { description },
    };
  }

  private formatEntityFields(description: Record<string, any>) {
    const {
      hideArmor,
      enableAttachables,
      heldItemIgnoresLighting,
      heldItemScale,
      queryableGeometry,
      spawnEgg,
    } = this.config;

    if (hideArmor !== undefined) {
      description.hide_armor = hideArmor;
    }

    if (enableAttachables !== undefined) {
      description.enable_attachables = enableAttachables;
    }

    if (heldItemIgnoresLighting !== undefined) {
      description.held_item_ignores_lighting = heldItemIgnoresLighting;
    }

    if (heldItemScale !== undefined) {
      description.held_item_scale = heldItemScale;
    }

    if (queryableGeometry !== undefined) {
      description.queryable_geometry = queryableGeometry;
    }

    if (spawnEgg !== undefined) {
      description.spawn_egg =
        'baseColor' in spawnEgg
          ? {
              base_color: spawnEgg.baseColor,
              overlay_color: spawnEgg.overlayColor,
            }
          : { texture: spawnEgg.texture, texture_index: spawnEgg.textureIndex };
    }
  }
}
