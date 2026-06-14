/**
 * Control flags for the move towards restriction behavior
 */
export type ControlFlag = 'move' | 'look';

export const CONTROL_FLAG: ControlFlag[] = ['move', 'look'] as const;
