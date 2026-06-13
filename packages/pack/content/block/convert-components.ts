import { blockComponentCreatorsFactory } from './components';
import { BlockComponents } from './interfaces/block-config';

export interface MinecraftBlockComponents {
  [key: string]: any;
}

export const convertBlockComponents = (
  components: BlockComponents,
): MinecraftBlockComponents | undefined => {
  let result: MinecraftBlockComponents = {};

  if (components === undefined || Object.keys(components).length === 0) {
    return;
  }

  for (const componentId in components) {
    const factory =
      blockComponentCreatorsFactory[
        componentId as keyof typeof blockComponentCreatorsFactory
      ];

    let componentData: any = {};
    if (factory !== undefined) {
      componentData = factory(
        components[componentId as keyof typeof components],
      );

      if (componentData === undefined) {
        console.warn(`Item component "${componentId}" is invalid. Skipping...`);
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
