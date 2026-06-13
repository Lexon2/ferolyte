import { MovableComponent } from '../interfaces/block-config';

/**
 * Creates a movable component for Minecraft blocks
 */
export const createMovable = (
  options?: MovableComponent,
): { 'minecraft:movable': any } | undefined => {
  if (options === undefined) {
    return undefined;
  }

  const validMovementTypes = ['push_pull', 'push', 'popped', 'immovable'];
  if (!validMovementTypes.includes(options.movementType)) {
    console.error(
      'Movement type must be "push_pull", "push", "popped", or "immovable"',
    );

    return undefined;
  }

  const result: any = {
    movement_type: options.movementType,
  };

  if (options.sticky !== undefined) {
    const validSticky = ['same', 'none'];
    if (!validSticky.includes(options.sticky)) {
      console.error('Sticky must be "same" or "none"');

      return undefined;
    }
    result.sticky = options.sticky;
  }

  return {
    'minecraft:movable': result,
  };
};
