import {
  withFieldPath,
  ContentDiagnosticContext,
} from '@ferolyte/common/content/diagnostics/content-diagnostic';
import { NameableComponent } from '../../../interfaces/components/miscellaneous/nameable-component';
import { convertTrigger } from '../../common/trigger.convertor';
import { validateBoolean } from '../../common/validation';

/**
 * Converts a NameableComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNameableComponent = (
  component: Partial<NameableComponent>,
  ctx?: ContentDiagnosticContext,
): { 'minecraft:nameable': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate allowNameTagRenaming
  if (component.allowNameTagRenaming !== undefined) {
    if (
      !validateBoolean(component.allowNameTagRenaming, 'allowNameTagRenaming')
    ) {
      return undefined;
    }
    result.allow_name_tag_renaming = component.allowNameTagRenaming;
  }

  // Validate alwaysShow
  if (component.alwaysShow !== undefined) {
    if (!validateBoolean(component.alwaysShow, 'alwaysShow')) {
      return undefined;
    }
    result.always_show = component.alwaysShow;
  }

  // Validate defaultTrigger
  if (component.defaultTrigger !== undefined) {
    const convertedDefaultTrigger = convertTrigger(
      component.defaultTrigger,
      withFieldPath(ctx, 'defaultTrigger'),
    );
    if (!convertedDefaultTrigger) {
      return undefined;
    }
    result.default_trigger = convertedDefaultTrigger;
  }

  // Validate nameActions
  if (component.nameActions !== undefined) {
    if (Array.isArray(component.nameActions)) {
      result.name_actions = component.nameActions
        .map((action) => {
          const actionResult: any = {};

          if (action.nameFilter !== undefined) {
            if (typeof action.nameFilter !== 'string') {
              console.error('nameFilter must be a string');

              return undefined;
            }
            actionResult.name_filter = action.nameFilter;
          }

          if (action.onNamed !== undefined) {
            const convertedOnNamed = convertTrigger(
              action.onNamed,
              withFieldPath(ctx, 'onNamed'),
            );
            if (!convertedOnNamed) {
              return undefined;
            }
            actionResult.on_named = convertedOnNamed;
          }

          return actionResult;
        })
        .filter(Boolean);
    } else {
      const actionResult: any = {};

      if (component.nameActions.nameFilter !== undefined) {
        if (typeof component.nameActions.nameFilter !== 'string') {
          console.error('nameFilter must be a string');

          return undefined;
        }
        actionResult.name_filter = component.nameActions.nameFilter;
      }

      if (component.nameActions.onNamed !== undefined) {
        const convertedOnNamed = convertTrigger(component.nameActions.onNamed);
        if (!convertedOnNamed) {
          return undefined;
        }
        actionResult.on_named = convertedOnNamed;
      }

      result.name_actions = actionResult;
    }
  }

  return {
    'minecraft:nameable': result,
  };
};
