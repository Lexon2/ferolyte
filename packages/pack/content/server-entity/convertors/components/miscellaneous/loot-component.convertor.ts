import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { LootComponent } from '../../../interfaces/components/miscellaneous/loot-component';
import { validateString } from '../../common/validation';

/**
 * Converts a LootComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertLootComponent = (
  component: Partial<LootComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:loot': any } | undefined => {
  if (!component || !component.table) {
    return undefined;
  }

  // Validate table
  if (!validateString(component.table, 'table')) {
    return undefined;
  }

  // Validate table path format
  if (!component.table.match(/^loot_tables\/.*\.json$/)) {
    console.error(
      'table must be a path to a loot table file in the format: loot_tables/*.json',
    );

    return undefined;
  }

  return {
    'minecraft:loot': {
      table: component.table,
    },
  };
};
