import { validateNumber, validateVector2 } from './validation';

type Range = number | [number, number] | { rangeMin: number; rangeMax: number };
type RangeResult = number | [number, number] | { range_min: number; range_max: number };

export const convertRange = (
  value: Range,
  fieldName: string,
  min?: number,
  max?: number,
): RangeResult | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    if (!validateNumber(value, fieldName, min, max)) {
      return undefined;
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (!validateVector2(value, fieldName, min, max) || value[0] > value[1]) {
      return undefined;
    }
    return value;
  }

  if (
    !validateNumber(value.rangeMin, `${fieldName}.rangeMin`, min, max) ||
    !validateNumber(value.rangeMax, `${fieldName}.rangeMax`, min, max) ||
    value.rangeMin > value.rangeMax
  ) {
    console.error(`${fieldName} must be a number, an array of two numbers, or an object with rangeMin and rangeMax properties`);

    return undefined;
  }
  return { range_min: value.rangeMin, range_max: value.rangeMax };
};
