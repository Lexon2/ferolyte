import { ClientEntityConfig } from './interfaces/client-entity-config';
import { ClientEntityAnimationResolver } from './interfaces/animations-collection';
import {
  formatEntityScriptsAnimate,
  parseMolangStatement,
} from '../molang/parse-molang-expression';
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
    return structuredClone(this.config);
  }

  public build(): any {
    const { config } = this;

    const entity: any = {
      format_version: config.version || '1.10.0',
      'minecraft:client_entity': {
        description: {
          identifier: config.identifier,
        },
      },
    };

    this.formatDescription(entity);
    this.formatScripts(entity);

    return entity;
  }

  private formatAnimations(animations: NonNullable<ClientEntityConfig['animations']>) {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(animations)) {
      if (typeof value === 'string') {
        result[key] = value;
      } else {
        result[key] = this.animationResolver
          ? this.animationResolver(this.config.identifier, key, value)
          : value.id;
      }
    }

    return result;
  }

  private formatDescription(entity: any) {
    const {
      geometry,
      textures,
      materials,
      minEngineVersion,
      animations,
      soundEffects,
      particleEffects,
      particleEmitters,
      renderControllers,
      hideArmor,
      enableAttachables,
      heldItemIgnoresLighting,
      queryableGeometry,
      spawnEgg,
    } = this.config;

    const description = entity['minecraft:client_entity'].description;

    if (geometry !== undefined) {
      if (typeof geometry === 'string') {
        description.geometry = {
          default: geometry,
        };
      } else {
        description.geometry = geometry;
      }
    }

    if (textures !== undefined) {
      if (typeof textures === 'string') {
        description.textures = {
          default: textures,
        };
      } else {
        description.textures = textures;
      }
    }

    if (materials !== undefined) {
      if (typeof materials === 'string') {
        description.materials = {
          default: materials,
        };
      } else {
        description.materials = materials;
      }
    }

    if (minEngineVersion !== undefined) {
      description.min_engine_version = minEngineVersion;
    }

    if (animations !== undefined) {
      description.animations = this.formatAnimations(animations);
    }

    if (soundEffects !== undefined) {
      description.sound_effects = soundEffects;
    }

    if (particleEffects !== undefined) {
      description.particle_effects = particleEffects;
    }

    if (particleEmitters !== undefined) {
      description.particle_emitters = particleEmitters;
    }

    if (renderControllers !== undefined) {
      description.render_controllers = renderControllers;
    }

    if (hideArmor !== undefined) {
      description.hide_armor = hideArmor;
    }

    if (enableAttachables !== undefined) {
      description.enable_attachables = enableAttachables;
    }

    if (heldItemIgnoresLighting !== undefined) {
      description.held_item_ignores_lighting = heldItemIgnoresLighting;
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

  private formatScripts(entity: any) {
    const { scripts } = this.config;
    if (scripts === undefined) {
      return;
    }

    const {
      animate,
      initialize,
      preAnimation,
      parentSetup,
      variables,
      scale,
      scalex,
      scaley,
      scalez,
      shouldUpdateBonesAndEffectsOffscreen,
      shouldUpdateEffectsOffscreen,
    } = scripts;

    const entityScripts =
      entity['minecraft:client_entity'].description.scripts ?? {};

    if (animate !== undefined) {
      entityScripts.animate = formatEntityScriptsAnimate(animate);
    }

    if (initialize !== undefined) {
      entityScripts.initialize = initialize.map(parseMolangStatement);
    }

    if (preAnimation !== undefined) {
      entityScripts.pre_animation = preAnimation.map(parseMolangStatement);
    }

    if (parentSetup !== undefined) {
      entityScripts.parent_setup = parentSetup;
    }

    if (variables !== undefined) {
      entityScripts.variables = variables;
    }

    if (scale !== undefined) {
      entityScripts.scale = scale;
    }

    if (scalex !== undefined) {
      entityScripts.scalex = scalex;
    }

    if (scaley !== undefined) {
      entityScripts.scaley = scaley;
    }

    if (scalez !== undefined) {
      entityScripts.scalez = scalez;
    }

    if (shouldUpdateBonesAndEffectsOffscreen !== undefined) {
      entityScripts.should_update_bones_and_effects_offscreen =
        shouldUpdateBonesAndEffectsOffscreen;
    }

    if (shouldUpdateEffectsOffscreen !== undefined) {
      entityScripts.should_update_effects_offscreen =
        shouldUpdateEffectsOffscreen;
    }

    if (Object.keys(entityScripts).length !== 0) {
      entity['minecraft:client_entity'].description.scripts = entityScripts;
    }
  }
}
