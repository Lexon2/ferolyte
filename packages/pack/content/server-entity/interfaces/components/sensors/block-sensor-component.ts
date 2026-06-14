import { EntityFilters } from '../../filters';

/**
 * Interface for the block_sensor component
 * Fires off a specified event when a block in the block list is broken within the sensor range
 */
export interface BlockSensorComponent {
  /**
   * The maximum radial distance in which a specified block can be detected
   * The biggest radius is 32.0
   * @default 0
   * @minimum 0
   * @maximum 32
   */
  sensorRadius?: number;

  /**
   * Blocks that will trigger the component when broken and what event will trigger
   */
  onBreak?: Array<{
    /**
     * List of blocks that will trigger the sensor
     */
    blockList: string[];

    /**
     * Event to run when a block breaks
     */
    onBlockBroken: string;
  }>;

  /**
   * List of sources that break the block to listen for
   * If none are specified, all block breaks will be detected
   */
  sources?: Array<EntityFilters>;
}
