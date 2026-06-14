import { describe, it } from 'vitest';
import { createRecord } from '@artifex/pack/content/item/convertors/components/record';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createRecord', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createRecord);
  });

  it('returns undefined for invalid sound event', () => {
    expectUndefined(createRecord, { soundEvent: 'invalid' });
  });

  it('returns undefined for comparator signal above 13', () => {
    expectUndefined(createRecord, { soundEvent: 'cat', comparatorSignal: 14 });
  });

  it('maps valid record', () => {
    expectComponent(createRecord, {
      soundEvent: 'cat',
      comparatorSignal: 5,
      duration: 180,
    }, 'minecraft:record', {
      sound_event: 'cat',
      comparator_signal: 5,
      duration: 180,
    });
  });
});
