import { ContentDiagnosticContext } from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { BossComponent } from '../../../interfaces/components/ai/boss-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a BossComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBossComponent = (
  component: Partial<BossComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:boss': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate shouldDarkenSky
  if (component.shouldDarkenSky !== undefined) {
    if (typeof component.shouldDarkenSky !== 'boolean') {
      console.error('shouldDarkenSky must be a boolean');

      return undefined;
    }
    result.should_darken_sky = component.shouldDarkenSky;
  }

  // Validate shouldPlayBossMusic
  if (component.shouldPlayBossMusic !== undefined) {
    if (typeof component.shouldPlayBossMusic !== 'boolean') {
      console.error('shouldPlayBossMusic must be a boolean');

      return undefined;
    }
    result.should_play_boss_music = component.shouldPlayBossMusic;
  }

  // Validate name
  if (component.name !== undefined) {
    if (typeof component.name !== 'string') {
      console.error('name must be a string');

      return undefined;
    }
    result.name = component.name;
  }

  // Validate hudRange
  if (component.hudRange !== undefined) {
    if (!validateNumber(component.hudRange, 'hudRange', 0, Number.MAX_VALUE)) {
      return undefined;
    }
    result.hud_range = component.hudRange;
  }

  return {
    'minecraft:boss': result,
  };
};
