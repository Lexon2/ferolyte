import { entityBehaviorConvertorsFactory } from './convertors/behavior-convertors.factory';
import { entityComponentConvertorsFactory } from './convertors/component-convertors-factory';
import { convertEntityEvents } from './convertors/entity-events.convertor';
import { convertEntityProperties } from './convertors/entity-properties.convertor';
import { EntityBehaviors } from './interfaces/entity-behaviors';
import { EntityComponents } from './interfaces/entity-components';
import { MinecraftServerEntity } from './interfaces/minecraft-server-entity';
import { ServerEntityConfig } from './interfaces/server-entity-config';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@artifex/common/content/diagnostics/content-diagnostic';
import { ContentBuilder } from '@artifex/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@artifex/common/content/metadata';

export class ServerEntityBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.SERVER_ENTITY;

  private config: ServerEntityConfig;
  private buildContext?: ContentDiagnosticContext;

  constructor(config: ServerEntityConfig) {
    this.config = config;
  }

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = { contentType: 'server-entity', ...ctx };

    return this;
  }

  public cloneConfig(): ServerEntityConfig {
    return structuredClone(this.config);
  }

  public build(): MinecraftServerEntity {
    const { config } = this;

    const entity: MinecraftServerEntity = {
      format_version: config.version || '1.21.70',
      'minecraft:entity': {
        description: {
          identifier: config.identifier,
        },
      },
    };

    this.formatDescription(entity);
    this.formatComponents(entity);
    this.formatComponentGroups(entity);
    this.formatEvents(entity);

    return entity;
  }

  // @TODO: Add MinecraftEntity interface
  private formatDescription(entity: any) {
    const {
      isExperimental,
      isSpawnable,
      isSummonable,
      spawnCategory,
      runtimeIdentifier,
      animations,
      scripts,
      properties,
    } = this.config;
    const { description } = entity['minecraft:entity'];

    description.is_spawnable = isSpawnable ?? true;
    description.is_summonable = isSummonable ?? true;
    description.is_experimental = isExperimental ?? false;

    if (spawnCategory !== undefined) {
      description.spawn_category = spawnCategory;
    }

    if (
      runtimeIdentifier !== undefined &&
      typeof runtimeIdentifier === 'string' &&
      runtimeIdentifier !== ''
    ) {
      description.runtime_identifier = runtimeIdentifier;
    }

    if (animations !== undefined) {
      description.animations = animations;
    }

    if (scripts !== undefined) {
      description.scripts = scripts;
    }

    if (properties !== undefined) {
      const convertedProperties = convertEntityProperties(properties);
      if (convertedProperties === undefined) {
        logContentError(this.buildContext, 'Entity properties are invalid');

        return;
      }
      description.properties = convertedProperties;
    }
  }

  /**
   * Convert the components to the MinecraftEntity format
   * @param components - The components to convert
   * @returns The converted components
   */
  private convertComponents(components: EntityComponents | undefined) {
    if (components === undefined || Object.keys(components).length === 0) {
      return;
    }

    let entityComponents: any = {};

    for (const component in components) {
      if (component === 'behaviors') {
        const convertedBehaviors = this.convertBehaviors(components.behaviors);
        if (convertedBehaviors === undefined) {
          logContentError(
            this.buildContext !== undefined
              ? {
                  ...this.buildContext,
                  component: 'behaviors',
                  fieldPath: undefined,
                }
              : undefined,
            'Entity behaviors are invalid',
          );
          continue;
        }
        entityComponents = { ...entityComponents, ...convertedBehaviors };
        continue;
      }

      const factory =
        entityComponentConvertorsFactory[component as keyof EntityComponents];
      if (factory === undefined) {
        logContentError(
          this.buildContext !== undefined
            ? { ...this.buildContext, component, fieldPath: undefined }
            : undefined,
          `Entity component "${component}" is not supported`,
        );
        continue;
      }
      const componentData = components[component as keyof typeof components];
      const componentContext: ContentDiagnosticContext | undefined =
        this.buildContext !== undefined
          ? { ...this.buildContext, component, fieldPath: undefined }
          : undefined;

      const minecraftComponent = factory(componentData, componentContext);
      if (minecraftComponent === undefined) {
        logContentError(
          componentContext,
          `Entity component "${component}" is invalid`,
        );
        continue;
      }
      entityComponents = { ...entityComponents, ...minecraftComponent };
    }

    return entityComponents;
  }

  private convertBehaviors(behaviors: Partial<EntityBehaviors> | undefined) {
    if (behaviors === undefined || Object.keys(behaviors).length === 0) {
      return;
    }

    let entityBehaviors: any = {};

    for (const behavior in behaviors) {
      const factory =
        entityBehaviorConvertorsFactory[behavior as keyof EntityBehaviors];
      if (factory === undefined) {
        logContentError(
          this.buildContext !== undefined
            ? {
                ...this.buildContext,
                component: 'behaviors',
                fieldPath: behavior,
              }
            : undefined,
          `Entity behavior "${behavior}" is not supported`,
        );
        continue;
      }

      const behaviorData = behaviors[behavior as keyof typeof behaviors];
      const behaviorContext: ContentDiagnosticContext | undefined =
        this.buildContext !== undefined
          ? {
              ...this.buildContext,
              component: 'behaviors',
              fieldPath: behavior,
            }
          : undefined;

      const minecraftBehavior = factory(behaviorData, behaviorContext);
      if (minecraftBehavior === undefined) {
        logContentError(
          behaviorContext,
          `Entity behavior "${behavior}" is invalid`,
        );
        continue;
      }
      entityBehaviors = { ...entityBehaviors, ...minecraftBehavior };
    }

    return entityBehaviors;
  }

  /**
   * Format the components to the MinecraftEntity format
   * @param entity - The entity to format
   */
  // @TODO: Add MinecraftEntity interface
  private formatComponents(entity: any) {
    const { components } = this.config;

    const entityComponents = this.convertComponents(components);
    entity['minecraft:entity'].components = entityComponents;
  }

  private formatComponentGroups(entity: any) {
    const { componentGroups } = this.config;

    if (
      componentGroups === undefined ||
      Object.keys(componentGroups).length === 0
    ) {
      return;
    }

    entity['minecraft:entity'].component_groups = {};

    for (const { components, name } of componentGroups) {
      const entityComponents = this.convertComponents(components);
      entity['minecraft:entity'].component_groups[name] = entityComponents;
    }
  }

  private formatEvents(entity: any) {
    const { events } = this.config;

    if (events === undefined || Object.keys(events).length === 0) {
      return;
    }

    const convertedEvents = convertEntityEvents(events, this.buildContext);
    if (convertedEvents === undefined) {
      return;
    }

    entity['minecraft:entity'].events = convertedEvents;
  }
}
