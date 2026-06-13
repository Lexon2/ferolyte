import { ClientEntityConfig } from './interfaces/client-entity-config';
import { ContentBuilder } from '../../common/interfaces/content.builder';
import { CONTENT_METADATA } from '../../compiler/content/content.metadata';

export class ClientEntityBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.CLIENT_ENTITY;

  private config: ClientEntityConfig;

  constructor(config: ClientEntityConfig) {
    this.config = config;
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
      description.animations = animations;
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
      description.spawn_egg = spawnEgg;
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
      const formattedAnimate: (Record<string, string> | string)[] = [];
      for (const item of animate) {
        if (typeof item === 'string') {
          formattedAnimate.push(item);
          continue;
        }

        // To handle object with multiple animations in it.
        for (const [key, value] of Object.entries(item)) {
          formattedAnimate.push({ [key]: value });
        }
      }
      entityScripts.animate = formattedAnimate;
    }

    if (initialize !== undefined) {
      entityScripts.initialize = initialize;
    }

    if (preAnimation !== undefined) {
      entityScripts.pre_animation = preAnimation;
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
