import { describe, expect, it } from 'vitest';
import {
  convertBlockStates,
  createBooleanState,
  createDirectionState,
  createEnumState,
  createFacingState,
  createIntState,
} from '@artifex/pack/content/block/states/convert-states';

describe('convertBlockStates', () => {
  it('returns undefined when input is missing', () => {
    expect(convertBlockStates()).toBeUndefined();
  });

  it('maps enum and int range states', () => {
    expect(convertBlockStates({
      direction: ['north', 'south'],
      power: { values: { min: 0, max: 15 } },
    })).toEqual({
      direction: ['north', 'south'],
      power: { values: { min: 0, max: 15 } },
    });
  });

  it('returns undefined for empty enum state', () => {
    expect(convertBlockStates({ direction: [] })).toBeUndefined();
  });

  it('returns undefined when min is greater than max', () => {
    expect(convertBlockStates({ power: { values: { min: 10, max: 5 } } })).toBeUndefined();
  });
});

describe('state helpers', () => {
  it('createEnumState validates values', () => {
    expect(createEnumState(['a', 'b'])).toEqual(['a', 'b']);
    expect(createEnumState([])).toBeUndefined();
  });

  it('createIntState validates range', () => {
    expect(createIntState(0, 15)).toEqual({ values: { min: 0, max: 15 } });
    expect(createIntState(10, 5)).toBeUndefined();
  });

  it('createBooleanState returns true/false strings', () => {
    expect(createBooleanState()).toEqual(['true', 'false']);
  });

  it('createDirectionState and createFacingState return directions', () => {
    expect(createDirectionState()).toEqual(['north', 'south', 'east', 'west']);
    expect(createFacingState()).toEqual(['north', 'south', 'east', 'west', 'up', 'down']);
  });
});
