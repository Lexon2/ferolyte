import { withFieldPath, ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { InsideBlockNotifierComponent, BlockNotifierEntry } from '../../../interfaces/components/sensors/inside-block-notifier-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateString } from '../../common/validation';

/**
 * Converts a BlockNotifierEntry to Minecraft format
 * @param entry The entry to convert
 * @returns The converted entry or undefined if validation fails
 */
const convertBlockNotifierEntry = (entry: BlockNotifierEntry): Record<string, any> | undefined => {
  if (!validateString(entry.block, 'block')) {
    return undefined;
  }

  const result: Record<string, any> = {
    block: entry.block
  };

  if (entry.enteredBlockEvent !== undefined) {
    const convertedEnteredBlockEvent = convertTrigger(entry.enteredBlockEvent, withFieldPath(ctx, 'enteredBlockEvent'));
    if (!convertedEnteredBlockEvent) {
      return undefined;
    }
    result.entered_block_event = convertedEnteredBlockEvent;
  }

  if (entry.exitedBlockEvent !== undefined) {
    const convertedExitedBlockEvent = convertTrigger(entry.exitedBlockEvent, withFieldPath(ctx, 'exitedBlockEvent'));
    if (!convertedExitedBlockEvent) {
      return undefined;
    }
    result.exited_block_event = convertedExitedBlockEvent;
  }

  return result;
};

/**
 * Converts an InsideBlockNotifierComponent to Minecraft format
 * @param component The component to convert
 * @returns The converted component in Minecraft format or undefined if validation fails
 */
export const convertInsideBlockNotifierComponent = (
  component: Partial<InsideBlockNotifierComponent>,
  ctx?: ContentDiagnosticContext
): Record<string, any> | undefined => {
  if (!component) {
    return undefined;
  }

  const result: Record<string, any> = {
    'minecraft:inside_block_notifier': {}
  };

  if (component.blockList) {
    const blockList = component.blockList
      .map(convertBlockNotifierEntry)
      .filter(Boolean);

    if (blockList.length > 0) {
      result['minecraft:inside_block_notifier'].block_list = blockList;
    }
  }

  return result;
};
