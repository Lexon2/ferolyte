export type HomeRestrictionType = 'random_movement' | 'all_movement' | 'none';

export const HOME_RESTRICTION_TYPE_VALUES: HomeRestrictionType[] = [
  'random_movement',
  'all_movement',
  'none',
];

/**
 * Validates a home restriction type
 * @param value The value to validate
 * @returns True if the value is a valid home restriction type, false otherwise
 */
export const validateHomeRestrictionType = (
  value: string,
): value is HomeRestrictionType => {
  if (!HOME_RESTRICTION_TYPE_VALUES.includes(value as HomeRestrictionType)) {
    console.error(`Invalid home restriction type: ${value}`);

    return false;
  }

  return true;
};
