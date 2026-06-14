import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { convertNumberFilter } from './common/convert-number-filter';
import { ActorHealthFilter } from '../../interfaces/filters/actor-health-filter';
import { MinecraftJsonFilter } from '../../interfaces/filters/minecraft-json-filter';

/**
 * Converts an ActorHealthFilter to Minecraft format
 * @param filter The filter to convert
 * @returns The filter in Minecraft format or undefined if validation fails
 */
export const convertActorHealthFilter = (
  filter: Partial<ActorHealthFilter>,
  ctx?: ContentDiagnosticContext
): MinecraftJsonFilter | undefined => {
  return convertNumberFilter({
    ...filter,
    test: 'actor_health',
  }, ctx);
};
