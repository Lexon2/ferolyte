import { blockComponentCreatorsFactory } from './components';
import { BlockComponentCreator } from './components/index';
import { BlockComponents } from './interfaces/block-config';
import { ContentDiagnosticContext } from '../../common/diagnostics/content-diagnostic';

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
    const factory =
      blockComponentCreatorsFactory[
        componentId as keyof typeof blockComponentCreatorsFactory
      ] as BlockComponentCreator | undefined;

    let componentData: any = {};
    if (factory !== undefined) {
      const componentContext: ContentDiagnosticContext | undefined =
        ctx !== undefined
          ? {
              ...ctx,
              section: 'components',
              component: componentId,
              fieldPath: undefined,
            }
          : undefined;

      componentData = factory(
        components[componentId as keyof typeof components],
        componentContext,
      );

      if (componentData === undefined) {
        continue;
      }
    } else {
      componentData = {
        [componentId]: components[componentId as keyof typeof components],
      };
    }

    result = { ...result, ...componentData };
  }

  return result;
};
