import {
  hintSnakeCaseComponent,
  hintSnakeCaseFields,
} from '@ferolyte/common/content/diagnostics/snake-case-hint';
import { convertEntityEvents } from './convertors/entity-events.convertor';
import { convertEntityProperties } from './convertors/entity-properties.convertor';
import { EntityBehaviors } from './interfaces/entity-behaviors';
import { convertGeneratedEntity } from './convertors/generated-entity';
import {
  entityBehaviorRegistry,
  entityComponentRegistry,
} from '../generated/entity/registry';
import { EntityComponents } from './interfaces/entity-components';
import { MinecraftServerEntity } from './interfaces/minecraft-server-entity';
import { ServerEntityConfig } from './interfaces/server-entity-config';
import { formatEntityScriptsAnimate } from '../molang/parse-molang-expression';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';

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
    this.validateProjectilePhysics();
    this.formatComponents(entity);
    this.formatComponentGroups(entity);
    this.formatEvents(entity);

    return entity;
  }

  /**
   * `isolated_physics` cannot be combined with a vanilla projectile
   * `runtime_identifier`.
   */
  private validateProjectilePhysics() {
    const { runtimeIdentifier, components } = this.config;
    if (
      components?.projectile?.isolatedPhysics === true &&
      typeof runtimeIdentifier === 'string' &&
      runtimeIdentifier.startsWith('minecraft:')
    ) {
      logContentError(
        this.buildContext !== undefined
          ? { ...this.buildContext, component: 'projectile' }
          : undefined,
        `projectile.isolatedPhysics cannot be used with the vanilla runtimeIdentifier "${runtimeIdentifier}"`,
      );
    }
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
      description.scripts = {
        animate: formatEntityScriptsAnimate(scripts.animate),
      };
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
        if (convertedBehaviors !== undefined) {
          entityComponents = { ...entityComponents, ...convertedBehaviors };
        }
        continue;
      }

      const componentContext: ContentDiagnosticContext = {
        contentType: 'server-entity',
        ...this.buildContext,
        component,
        fieldPath: undefined,
        formatVersion: this.formatVersion(),
      };
      const generated = entityComponentRegistry[component];
      if (generated === undefined) {
        hintSnakeCaseComponent(
          component,
          (camel) => camel in entityComponentRegistry,
          componentContext,
        );
        logContentError(
          componentContext,
          `Entity component "${component}" is not supported`,
        );
        continue;
      }

      const converted = convertGeneratedEntity(
        generated,
        components[component as keyof typeof components],
        componentContext,
      );
      if (converted !== undefined) {
        entityComponents = { ...entityComponents, ...converted };
      }
    }

    return entityComponents;
  }

  /** The `version` of the config, else the profile `minGameVersion`. */
  private formatVersion(): string | undefined {
    return this.config.version || this.buildContext?.minGameVersion || undefined;
  }

  private convertBehaviors(behaviors: Partial<EntityBehaviors> | undefined) {
    if (behaviors === undefined || Object.keys(behaviors).length === 0) {
      return;
    }

    let entityBehaviors: any = {};

    for (const behavior in behaviors) {
      const behaviorContext: ContentDiagnosticContext = {
        contentType: 'server-entity',
        ...this.buildContext,
        component: 'behaviors',
        fieldPath: behavior,
        formatVersion: this.formatVersion(),
      };
      const generated = entityBehaviorRegistry[behavior];
      if (generated === undefined) {
        logContentError(
          behaviorContext,
          `Entity behavior "${behavior}" is not supported`,
        );
        continue;
      }

      const converted = convertGeneratedEntity(
        generated,
        behaviors[behavior as keyof typeof behaviors],
        behaviorContext,
      );
      if (converted !== undefined) {
        entityBehaviors = { ...entityBehaviors, ...converted };
      }
    }

    return entityBehaviors;
  }

  /**
   * Format the components to the MinecraftEntity format
   * @param entity - The entity to format
   */
  // @TODO: Add MinecraftEntity interface
  private formatComponents(entity: any) {
    const { components, rawComponents } = this.config;

    const entityComponents = this.convertComponents(components);
    entity['minecraft:entity'].components = this.mergeRawComponents(
      entityComponents,
      rawComponents,
    );
  }

  private mergeRawComponents(
    converted: Record<string, unknown> | undefined,
    raw: Record<string, unknown> | undefined,
  ) {
    if (raw === undefined || Object.keys(raw).length === 0) {
      return converted;
    }

    return { ...converted, ...raw };
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

    for (const { components, rawComponents, name } of componentGroups) {
      const entityComponents = this.convertComponents(components);
      entity['minecraft:entity'].component_groups[name] =
        this.mergeRawComponents(entityComponents, rawComponents) ?? {};
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
