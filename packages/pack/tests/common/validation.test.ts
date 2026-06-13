import { describe, expect, it, vi } from 'vitest';

import {
  buildFieldPath,
  logContentError,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateNonEmptyString,
  validatePositiveNumber,
} from '@artifex/pack/common/validation/content-validation';

describe('buildFieldPath', () => {
  it('builds a full component field path', () => {
    expect(
      buildFieldPath({
        component: 'allowOffHand',
      }),
    ).toBe('components.allowOffHand');
  });

  it('includes nested field paths', () => {
    expect(
      buildFieldPath({
        component: 'throwable',
        fieldPath: 'maxDrawDuration',
      }),
    ).toBe('components.throwable.maxDrawDuration');
  });
});

describe('logContentError', () => {
  it('logs Artifex-style validation output', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logContentError(
      {
        sourceFile: 'E:/project/items/my_sword.item.ts',
        component: 'allowOffHand',
        contentType: 'item',
      },
      'Allow off hand must be a boolean',
    );

    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toContain('🛑 Item validation error');
    expect(errorSpy.mock.calls[0][0]).toContain('my_sword.item.ts');
    expect(errorSpy.mock.calls[0][0]).toContain('components.allowOffHand');
    expect(errorSpy.mock.calls[0][0]).toContain(
      'Allow off hand must be a boolean',
    );

    errorSpy.mockRestore();
  });

  it('does not log when debug is false', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logContentError(
      {
        debug: false,
        component: 'allowOffHand',
      },
      'Allow off hand must be a boolean',
    );

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('content validation helpers', () => {
  it('validateBooleanValue returns false for invalid values', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(
      validateBooleanValue('invalid', {
        sourceFile: 'test.item.ts',
        component: 'glint',
      }),
    ).toBe(false);

    errorSpy.mockRestore();
  });

  it('validateNonEmptyString accepts valid strings', () => {
    expect(
      validateNonEmptyString('namespace:block', undefined, 'Must be a string'),
    ).toBe(true);
  });

  it('validatePositiveNumber rejects non-positive values', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(
      validatePositiveNumber(
        0,
        { component: 'fuel', fieldPath: 'duration' },
        'Fuel duration must be a positive number',
        'duration',
      ),
    ).toBe(false);

    errorSpy.mockRestore();
  });
});
