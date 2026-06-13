import { EmbeddedVisualComponent } from '../interfaces/block-config';
import { ContentDiagnosticContext } from '../../../common/diagnostics/content-diagnostic';
import { createItemVisual } from './item-visual';

/**
 * Creates an embedded_visual component for Minecraft blocks
 */
export const createEmbeddedVisual = (
  options?: EmbeddedVisualComponent,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:embedded_visual': any } | undefined => {
  const itemVisual = createItemVisual(options, ctx);
  if (itemVisual === undefined) {
    return undefined;
  }

  return {
    'minecraft:embedded_visual': itemVisual['minecraft:item_visual'],
  };
};
