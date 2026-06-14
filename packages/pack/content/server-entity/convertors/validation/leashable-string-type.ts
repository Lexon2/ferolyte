export type LeashableSpringType = 'bouncy' | 'quad_dampened' | 'dampened';

export const LEASHABLE_SPRING_TYPES = [
  'bouncy',
  'quad_dampened',
  'dampened',
] as const;

export function validateSpringType(springType: LeashableSpringType) {
  if (!LEASHABLE_SPRING_TYPES.includes(springType)) {
    console.error(`Invalid spring type: ${springType}`);

    return false;
  }
  return true;
}
