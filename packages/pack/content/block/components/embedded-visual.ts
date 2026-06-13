import { EmbeddedVisualComponent } from '../interfaces/block-config';
import { createItemVisual } from './item-visual';

/**
 * Creates an embedded_visual component for Minecraft blocks
 */
export const createEmbeddedVisual = (
  options?: EmbeddedVisualComponent,
): { 'minecraft:embedded_visual': any } | undefined => {
  const itemVisual = createItemVisual(options);
  if (itemVisual === undefined) {
    return undefined;
  }

  return {
    'minecraft:embedded_visual': itemVisual['minecraft:item_visual'],
  };
};
