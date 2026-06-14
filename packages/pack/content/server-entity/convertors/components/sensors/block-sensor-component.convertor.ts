import { ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import { BlockSensorComponent } from '../../../interfaces/components/sensors/block-sensor-component';
import { validateNumber, validateString } from '../../common/validation';

/**
 * Validates a block list item
 * @param item The item to validate
 * @param fieldName The name of the field for error messages
 * @returns Whether the item is valid
 */
const validateBlockListItem = (
  item: { blockList: string[]; onBlockBroken: string },
  fieldName: string,
): boolean => {
  if (!Array.isArray(item.blockList)) {
    console.error(`${fieldName}.blockList must be an array`);

    return false;
  }

  const validatedBlocks = item.blockList.map((block, index) => {
    if (!validateString(block, `${fieldName}.blockList[${index}]`)) {
      return undefined;
    }
    return block;
  });

  if (validatedBlocks.includes(undefined)) {
    return false;
  }

  if (!validateString(item.onBlockBroken, `${fieldName}.onBlockBroken`)) {
    return false;
  }

  return true;
};

/**
 * Converts a BlockSensorComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertBlockSensorComponent = (
  component: Partial<BlockSensorComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:block_sensor': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate sensorRadius
  if (component.sensorRadius !== undefined) {
    if (!validateNumber(component.sensorRadius, 'sensorRadius', 0, 32)) {
      return undefined;
    }
    result.sensor_radius = component.sensorRadius;
  }

  // Validate onBreak
  if (component.onBreak !== undefined) {
    if (!Array.isArray(component.onBreak)) {
      console.error('onBreak must be an array');

      return undefined;
    }

    const validatedItems = component.onBreak.map((item, index) => {
      if (!validateBlockListItem(item, `onBreak[${index}]`)) {
        return undefined;
      }

      return {
        block_list: item.blockList,
        on_block_broken: item.onBlockBroken,
      };
    });

    if (validatedItems.includes(undefined)) {
      return undefined;
    }

    result.on_break = validatedItems;
  }

  // Validate sources
  if (component.sources !== undefined) {
    if (!Array.isArray(component.sources)) {
      console.error('sources must be an array');

      return undefined;
    }

    // Sources are filters that are validated elsewhere
    result.sources = component.sources;
  }

  return {
    'minecraft:block_sensor': result,
  };
};
