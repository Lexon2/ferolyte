import {
  hintSnakeCaseComponent,
  hintSnakeCaseFields,
} from '@ferolyte/common/content/diagnostics/snake-case-hint';
import {
  ContentDiagnosticContext,
  logContentError,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
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

  return result;
};
