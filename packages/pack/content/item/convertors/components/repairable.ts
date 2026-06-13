import { ContentDiagnosticContext } from '../../../../common/diagnostics/content-diagnostic';
import { logContentError } from '../../../../common/diagnostics/content-diagnostic';
import { validateNonEmptyArray } from '../../../../common/validation/content-validation';

interface RepairItem {
  items: string[];
  repairAmount: string | number;
}

interface RepairableOptions {
  repairItems?: RepairItem[];
}

/**
 * Creates a repairable component for Minecraft items
 * @param options The repairable options
 * @returns The repairable component in Minecraft format or undefined if validation fails
 */
export const createRepairable = (
  options?: RepairableOptions,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:repairable': any } | undefined => {
  if (!options) {
    return undefined;
  }

  const result: any = {};

  if (Array.isArray(options.repairItems) && options.repairItems.length > 0) {
    const repairItems: { items: string[]; repair_amount: string | number }[] =
      [];

    for (let index = 0; index < options.repairItems.length; index++) {
      const item = options.repairItems[index];
      const entryContext =
        ctx !== undefined
          ? { ...ctx, fieldPath: `repairItems[${index}]` }
          : undefined;

      if (
        !validateNonEmptyArray(
          item.items,
          entryContext,
          'Repair items must have a non-empty items array',
          'items',
        )
      ) {
        return undefined;
      }

      if (
        (typeof item.repairAmount !== 'string' &&
          typeof item.repairAmount !== 'number') ||
        (typeof item.repairAmount === 'string' &&
          item.repairAmount.length === 0) ||
        (typeof item.repairAmount === 'number' && item.repairAmount <= 0)
      ) {
        logContentError(
          entryContext !== undefined
            ? { ...entryContext, fieldPath: 'repairAmount' }
            : undefined,
          'Repair amount must be a positive number or non-empty string',
        );
        return undefined;
      }

      repairItems.push({
        items: item.items,
        repair_amount: item.repairAmount,
      });
    }

    result.repair_items = repairItems;
  }

  return {
    'minecraft:repairable': result,
  };
};
