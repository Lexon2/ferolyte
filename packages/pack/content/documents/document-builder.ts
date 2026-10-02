import type { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import type { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import {
  DocumentConfigs,
  DocumentKind,
  convertDocument,
} from './convert-document';

const METADATA = {
  attachable: CONTENT_METADATA.ATTACHABLE,
  renderController: CONTENT_METADATA.RENDER_CONTROLLER,
  recipe: CONTENT_METADATA.RECIPE,
  spawnRule: CONTENT_METADATA.SPAWN_RULE,
} as const;

const CONTENT_TYPE = {
  attachable: 'attachable',
  renderController: 'render-controller',
  recipe: 'recipe',
  spawnRule: 'spawn-rule',
} as const;

/** Format version written when the config has none (`formatVersion`). */
const DEFAULT_FORMAT_VERSION: Record<DocumentKind, string> = {
  attachable: '1.10.0',
  renderController: '1.10.0',
  recipe: '1.20.10',
  spawnRule: '1.8.0',
};

const asRecord = (value: unknown): Record<string, any> | undefined =>
  typeof value === 'object' && value !== null
    ? (value as Record<string, any>)
    : undefined;

/**
 * Builder of a whole generated document (attachable, render controller, recipe, spawn rule): no SDK sugar,
 * the config mirrors the JSON file in camelCase and the generated schema runtime converts and validates it.
 */
export class DocumentBuilder<K extends DocumentKind = DocumentKind>
  implements ContentBuilder
{
  readonly metadata: (typeof METADATA)[K];

  protected buildContext?: ContentDiagnosticContext;

  constructor(
    readonly kind: K,
    protected readonly config: Partial<DocumentConfigs[K]>,
  ) {
    this.metadata = METADATA[kind];
  }

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = { contentType: CONTENT_TYPE[this.kind], ...ctx };

    return this;
  }

  public cloneConfig(): Partial<DocumentConfigs[K]> {
    return structuredClone(this.config);
  }

  /**
   * Identifier that names the output file: the attachable / spawn rule `description.identifier` or the
   * identifier of the first recipe. Render controllers have no single identifier (the source file names them).
   */
  public identifier(): string | undefined {
    const config = asRecord(this.config);
    switch (this.kind) {
      case 'attachable':
        return config?.attachable?.description?.identifier;
      case 'spawnRule':
        return config?.spawnRules?.description?.identifier;
      case 'recipe': {
        for (const [key, value] of Object.entries(config ?? {})) {
          if (key !== 'formatVersion') {
            return asRecord(value)?.description?.identifier;
          }
        }

        return undefined;
      }
      default:
        return undefined;
    }
  }

  public build(): Record<string, unknown> {
    return convertDocument(
      this.kind,
      this.config,
      this.buildContext === undefined
        ? undefined
        : { identifier: this.identifier(), ...this.buildContext },
      { formatVersion: DEFAULT_FORMAT_VERSION[this.kind] },
    );
  }
}
