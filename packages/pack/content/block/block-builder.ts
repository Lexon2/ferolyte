import { checkCustomComponentVersion } from '../common/custom-component-version';
import { cloneConfig } from '@ferolyte/common/object/clone-config';
import { convertBlockComponents } from './convert-components';
import { BlockComponents, BlockConfig } from './interfaces/block-config';
import { createBlockPermutations } from './permutations/create-permuation';
import { convertBlockStates } from './states/convert-states';
import { convertBlockTraits } from './traits/convert-traits';
import { ContentBuilder } from '@ferolyte/common/content/interfaces/content-builder';
import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';
import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { convertMenuCategory } from '../item/convertors/components/menu-category/convert-category';

export class BlockBuilder implements ContentBuilder {
  readonly metadata = CONTENT_METADATA.BLOCK;

  private config: BlockConfig;
  private buildContext?: ContentDiagnosticContext;

  constructor(config: BlockConfig) {
    this.config = config;
  }

  public withBuildContext(ctx: ContentDiagnosticContext): this {
    this.buildContext = { contentType: 'block', ...ctx };
    return this;
  }

  public cloneConfig(): any {
    return cloneConfig(this.config);
  }

  public fileName(): string {
    const { identifier } = this.config;
    const parts = identifier.split(':');
    const fileName = parts[parts.length - 1];

    return `${fileName}.block.json`;
  }

  private defaultFormatVersion(): string {
    const minVersion = this.buildContext?.minGameVersion;

    return minVersion !== undefined &&
      minVersion.length > 0 &&
      isVersionAtLeast(minVersion, '1.26.40')
      ? isVersionAtLeast(minVersion, '1.26.50')
        ? '1.26.50'
        : '1.26.40'
      : '1.21.70';
  }

  public build(): any {
    const { config } = this;

    const minecraftBlock = {
      format_version: config.version || this.defaultFormatVersion(),
      'minecraft:block': {
        description: {
          identifier: config.identifier,
        },
      },
    };

    this.formatDescription(minecraftBlock);
    this.formatComponents(minecraftBlock);
    this.formatPermutations(minecraftBlock);
    this.formatStates(minecraftBlock);
    this.formatTraits(minecraftBlock);

    return minecraftBlock;
  }

  private formatDescription(file: any) {
    const { menuCategory } = this.config;
    const { description } = file['minecraft:block'];

    const menuCategoryContext: ContentDiagnosticContext | undefined =
      this.buildContext !== undefined
        ? { ...this.buildContext, section: 'menuCategory' }
        : undefined;

    const validatedMenuCategory = menuCategory
      ? convertMenuCategory(menuCategory, menuCategoryContext)
      : undefined;
    if (validatedMenuCategory !== undefined) {
      description.menu_category = validatedMenuCategory;
    }
  }

  private formatComponents(file: any) {
    const { components, rawComponents } = this.config;

    checkCustomComponentVersion(
      [...Object.keys(components ?? {}), ...Object.keys(rawComponents ?? {})],
      this.config.version || this.defaultFormatVersion(),
      this.buildContext && { contentType: 'block', ...this.buildContext },
    );

    const minecraftComponents =
      components !== undefined
        ? convertBlockComponents(components, {
            contentType: 'block',
            ...this.buildContext,
            formatVersion:
              this.config.version ||
              this.buildContext?.minGameVersion ||
              undefined,
            outputVersion: this.config.version || this.defaultFormatVersion(),
          })
        : undefined;
    if (
      minecraftComponents === undefined &&
      (rawComponents === undefined || Object.keys(rawComponents).length === 0)
    ) {
      return;
    }

    file['minecraft:block'].components = {
      ...minecraftComponents,
      ...rawComponents,
    };
  }

  private formatPermutations(file: any) {
    const { permutations } = this.config;
    if (permutations === undefined) {
      return;
    }

    const permutationsContext: ContentDiagnosticContext = {
      contentType: 'block',
      ...this.buildContext,
      section: 'permutations',
      outputVersion: this.config.version || this.defaultFormatVersion(),
    };

    const minecraftPermutations = createBlockPermutations(
      permutations,
      permutationsContext,
    );
    if (minecraftPermutations === undefined) {
      return;
    }

    file['minecraft:block'].permutations = [...minecraftPermutations];
  }

  private formatStates(file: any) {
    const { states } = this.config;
    if (states === undefined) {
      return;
    }

    const statesContext: ContentDiagnosticContext | undefined =
      this.buildContext !== undefined
        ? { ...this.buildContext, section: 'states' }
        : undefined;

    const minecraftStates = convertBlockStates(states, statesContext);
    if (minecraftStates === undefined) {
      return;
    }

    file['minecraft:block'].description.states = { ...minecraftStates };
  }

  private formatTraits(file: any) {
    const { traits } = this.config;
    if (traits === undefined) {
      return;
    }

    const traitsContext: ContentDiagnosticContext | undefined =
      this.buildContext !== undefined
        ? { ...this.buildContext, section: 'traits' }
        : undefined;

    const minecraftTraits = convertBlockTraits(
      traits,
      traitsContext,
      this.config.components as BlockComponents | undefined,
      this.config.version || this.defaultFormatVersion(),
    );
    if (minecraftTraits === undefined) {
      return;
    }

    file['minecraft:block'].description.traits = { ...minecraftTraits };
  }
}
