import { cloneConfig } from '@ferolyte/common/object/clone-config';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { convertDocument } from '../documents/convert-document';
import type { RenderControllerDocument } from '../generated/render-controller/documents';
import type { MolangBuilder } from '../molang/format-molang-value';
import { parseMolangExpression } from '../molang/parse-molang-expression';

const ID_PREFIX = 'controller.render.';

/** Every string of the type may also be a Molang v2 builder. */
type WithMolang<T> = T extends MolangBuilder
  ? T
  : T extends string
  ? string | MolangBuilder
  : T extends (infer U)[]
    ? WithMolang<U>[]
    : T extends object
      ? { [K in keyof T]: WithMolang<T[K]> }
      : T;

type RenderControllerBody = NonNullable<
  RenderControllerDocument['renderControllers']
>[string];

/**
 * One render controller (the body of `render_controllers.<id>` in camelCase): `geometry`, `materials`,
 * `textures`, `partVisibility`, `arrays`, `isHurtColor`, ... Molang v2 builders or strings everywhere.
 */
export type RenderControllerConfig = WithMolang<RenderControllerBody> & {
  /** Must start with `controller.render.`. */
  id: `${typeof ID_PREFIX}${string}`;
  /** @default '1.10.0' */
  formatVersion?: string;
};

const stringify = (value: unknown): unknown => {
  if (
    (typeof value === 'object' || typeof value === 'function') &&
    value !== null &&
    typeof (value as MolangBuilder).build === 'function'
  ) {
    return parseMolangExpression(value as MolangBuilder);
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(stringify);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, stringify(item)]),
  );
};

export class RenderControllerBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.RENDER_CONTROLLER;

  readonly kind = 'renderController' as const;

  private buildContext?: ContentDiagnosticContext;

  constructor(private readonly config: RenderControllerConfig) {}

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = { contentType: 'render-controller', ...ctx };

    return this;
  }

  public cloneConfig(): RenderControllerConfig {
    return cloneConfig(this.config);
  }

  public get id(): string {
    return this.config.id;
  }

  /** Render controllers have no single identifier: the source file names the output. */
  public identifier(): undefined {
    return undefined;
  }

  private body(): RenderControllerBody {
    const { id: _id, formatVersion: _version, ...body } = this.config;

    return stringify(body) as RenderControllerBody;
  }

  /** One file with every render controller of the list. */
  public static buildFile(
    builders: RenderControllerBuilder[],
  ): Record<string, unknown> {
    const controllers: Record<string, RenderControllerBody> = {};
    let formatVersion = '1.10.0';
    for (const builder of builders) {
      const { id } = builder.config;
      if (!id.startsWith(ID_PREFIX) || id.length === ID_PREFIX.length) {
        logContentError(
          builder.buildContext && {
            ...builder.buildContext,
            identifier: id,
            fieldPath: 'id',
          },
          `Render controller id must start with "${ID_PREFIX}"`,
        );
      }
      controllers[id] = builder.body();
      formatVersion = builder.config.formatVersion ?? formatVersion;
    }

    const [first] = builders;

    return convertDocument(
      'renderController',
      { formatVersion, renderControllers: controllers },
      first?.buildContext && {
        ...first.buildContext,
        identifier: builders.map((b) => b.config.id).join(', '),
      },
    );
  }

  public build(): Record<string, unknown> {
    return RenderControllerBuilder.buildFile([this]);
  }
}
