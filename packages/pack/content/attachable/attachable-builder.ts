import { cloneConfig } from '@ferolyte/common/object/clone-config';
import type { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import type { ClientEntityAnimationResolver } from '../client-entity/interfaces/animations-collection';
import type { MolangBuilder } from '../molang/format-molang-value';
import { parseMolangExpression } from '../molang/parse-molang-expression';
import {
  formatRenderDescription,
  type RenderDescriptionFields,
  type RenderScriptsFields,
} from '../render-description/render-description';

/**
 * Attachable (item model worn / held by entities). Same flat form as `createClientEntity`:
 * the render description (geometry, textures, materials, animations, scripts, render controllers) is shared.
 */
export interface AttachableConfig extends RenderDescriptionFields {
  /** Identifier of the attachable (usually the item id). */
  identifier: string;
  /** @default '1.10.0' */
  version?: string;
  /**
   * Items the attachable applies to: `{ 'ns:sword': 'query.is_owner_identifier_any(...)' }`;
   * a plain string means `{ [id]: 'true' }`.
   */
  item?: string | Record<string, string | MolangBuilder>;
  scripts?: RenderScriptsFields;
}

export class AttachableBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.ATTACHABLE;

  readonly kind = 'attachable' as const;

  private buildContext?: ContentDiagnosticContext;

  private animationResolver?: ClientEntityAnimationResolver;

  constructor(private readonly config: AttachableConfig) {}

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = { contentType: 'attachable', ...ctx };

    return this;
  }

  /** Installs the resolver that turns animations with options into derived ids. */
  public withAnimationResolver(resolver: ClientEntityAnimationResolver): this {
    this.animationResolver = resolver;

    return this;
  }

  public cloneConfig(): AttachableConfig {
    return cloneConfig(this.config);
  }

  /** Names the output file. */
  public identifier(): string {
    return this.config.identifier;
  }

  public build(): Record<string, unknown> {
    const { config } = this;
    const description: Record<string, any> = { identifier: config.identifier };

    if (config.item !== undefined) {
      description.item =
        typeof config.item === 'string'
          ? { [config.item]: 'true' }
          : Object.fromEntries(
              Object.entries(config.item).map(([id, condition]) => [
                id,
                parseMolangExpression(condition),
              ]),
            );
    }
    formatRenderDescription(config, description, this.animationResolver);

    return {
      format_version: config.version ?? '1.10.0',
      'minecraft:attachable': { description },
    };
  }
}
