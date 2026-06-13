import { describe, expect, it, vi } from 'vitest';

import {
  buildFieldPath,
  logContentError,
} from '@artifex/pack/common/diagnostics/content-diagnostic';
import {
  validateBooleanValue,
  validateNonEmptyString,
  validatePositiveNumber,
  validateVector3,
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

  it('builds block section field paths', () => {
    expect(
      buildFieldPath({
        section: 'states',
        fieldPath: 'direction',
        contentType: 'block',
      }),
    ).toBe('states.direction');

    expect(
      buildFieldPath({
        section: 'traits',
        fieldPath: 'placementDirection.states',
        contentType: 'block',
      }),
    ).toBe('traits.placementDirection.states');

    expect(
      buildFieldPath({
        section: 'permutations',
        fieldPath: '[0].components.collisionBox',
        contentType: 'block',
      }),
    ).toBe('permutations[0].components.collisionBox');

    expect(
      buildFieldPath({
        section: 'menuCategory',
        fieldPath: 'category',
        contentType: 'block',
      }),
    ).toBe('menuCategory.category');

    expect(
      buildFieldPath({
        section: 'components',
        component: 'collisionBox',
        fieldPath: 'origin',
        contentType: 'block',
      }),
    ).toBe('components.collisionBox.origin');
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

  it('does not log when diagnostics is false', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    logContentError(
      {
        diagnostics: false,
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

  it('validateVector3 accepts valid arrays and rejects invalid values', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(
      validateVector3([0, 0.5, 1], {
        section: 'components',
        component: 'collisionBox',
        fieldPath: 'origin',
        contentType: 'block',
      }),
    ).toBe(true);

    expect(
      validateVector3([0, 1], {
        section: 'components',
        component: 'collisionBox',
        fieldPath: 'origin',
        contentType: 'block',
      }),
    ).toBe(false);

    errorSpy.mockRestore();
  });
});
