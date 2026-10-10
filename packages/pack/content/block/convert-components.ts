import {
  hintSnakeCaseComponent,
  hintSnakeCaseFields,
} from '@ferolyte/common/content/diagnostics/snake-case-hint';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { isVersionAtLeast } from '@ferolyte/common/content/versions/compare-version';
import { blockComponentRegistry } from '../generated/block/registry';
import {
  convertWithOverride,
  passthroughNormalizers,
} from '../generated/runtime';
import { BlockComponents } from './interfaces/block-config';
import { blockOverrides } from './overrides';

export interface MinecraftBlockComponents {
  [key: string]: any;
}

export const convertBlockComponents = (
  components: BlockComponents,
  ctx?: ContentDiagnosticContext,
): MinecraftBlockComponents | undefined => {
  let result: MinecraftBlockComponents = {};

  if (components === undefined || Object.keys(components).length === 0) {
    return;
  }

  for (const componentId in components) {
    const generated = blockComponentRegistry[componentId];
    const componentData = components[componentId as keyof typeof components];

    if (generated === undefined) {
      hintSnakeCaseComponent(
        componentId,
        (camel) => camel in blockComponentRegistry,
        ctx !== undefined
          ? { ...ctx, component: componentId, fieldPath: undefined }
          : undefined,
      );
      // Namespaced custom components pass through; unknown vanilla-style keys are errors.
      if (componentId.includes(':')) {
        result = { ...result, [componentId]: componentData };
      } else {
        logContentError(
          ctx !== undefined
            ? { ...ctx, component: componentId, fieldPath: undefined }
            : undefined,
          `Block component "${componentId}" is not supported`,
        );
      }
      continue;
    }

    const componentContext: ContentDiagnosticContext | undefined =
      ctx !== undefined
        ? {
            ...ctx,
            section: 'components',
            component: componentId,
            fieldPath: undefined,
          }
        : undefined;

    hintSnakeCaseFields(componentData, componentContext);
    const converted = convertWithOverride(
      generated,
      componentData,
      passthroughNormalizers,
      componentContext,
      blockOverrides[componentId],
    );

    if (converted !== undefined) {
      result = { ...result, ...converted };
    }
  }

  if (
    ctx?.outputVersion !== undefined &&
    isVersionAtLeast(ctx.outputVersion, '1.26.20')
  ) {
    numericAmbientOcclusion(result);
  }

  return result;
};

const MATERIAL_INSTANCE_OWNERS = [
  'minecraft:material_instances',
  'minecraft:item_visual',
  'minecraft:embedded_visual',
];

/**
 * From block format 1.26.20 `ambient_occlusion` is a number (the exponent, 0-10; the game rejects a boolean):
 * `true` is written as `1` (the default exponent), `false` as `0`.
 */
const numericAmbientOcclusion = (components: MinecraftBlockComponents): void => {
  for (const owner of MATERIAL_INSTANCE_OWNERS) {
    const component = components[owner];
    const instances =
      owner === 'minecraft:material_instances'
        ? component
        : component?.material_instances;
    if (instances === null || typeof instances !== 'object') {
      continue;
    }
    for (const instance of Object.values(instances)) {
      if (
        instance !== null &&
        typeof instance === 'object' &&
        typeof (instance as any).ambient_occlusion === 'boolean'
      ) {
        (instance as any).ambient_occlusion = (instance as any).ambient_occlusion ? 1 : 0;
      }
    }
  }
};
