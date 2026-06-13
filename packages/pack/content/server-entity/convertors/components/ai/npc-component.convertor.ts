import { ContentDiagnosticContext } from '@artifex/pack/common/diagnostics/content-diagnostic';
import { NpcComponent } from '../../../interfaces/components/ai/npc-component';
import { validateNumber } from '../../common/validation';

/**
 * Converts a NpcComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertNpcComponent = (
  component: Partial<NpcComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:npc': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate npcData
  if (component.npcData !== undefined) {
    const npcData: any = {};

    // Validate portraitOffsets
    if (component.npcData.portraitOffsets !== undefined) {
      const portraitOffsets: any = {};

      // Validate portrait translate
      if (component.npcData.portraitOffsets.translate !== undefined) {
        if (!Array.isArray(component.npcData.portraitOffsets.translate) ||
            component.npcData.portraitOffsets.translate.length !== 3) {
          console.error('portraitOffsets.translate must be an array of 3 numbers');

          return undefined;
        }
        for (const num of component.npcData.portraitOffsets.translate) {
          if (!validateNumber(num, 'portraitOffsets.translate', -Number.MAX_VALUE, Number.MAX_VALUE)) {
            return undefined;
          }
        }
        portraitOffsets.translate = component.npcData.portraitOffsets.translate;
      }

      // Validate portrait scale
      if (component.npcData.portraitOffsets.scale !== undefined) {
        if (!Array.isArray(component.npcData.portraitOffsets.scale) ||
            component.npcData.portraitOffsets.scale.length !== 3) {
          console.error('portraitOffsets.scale must be an array of 3 numbers');

          return undefined;
        }
        for (const num of component.npcData.portraitOffsets.scale) {
          if (!validateNumber(num, 'portraitOffsets.scale', 0, Number.MAX_VALUE)) {
            return undefined;
          }
        }
        portraitOffsets.scale = component.npcData.portraitOffsets.scale;
      }

      npcData.portrait_offsets = portraitOffsets;
    }

    // Validate pickerOffsets
    if (component.npcData.pickerOffsets !== undefined) {
      const pickerOffsets: any = {};

      // Validate picker translate
      if (component.npcData.pickerOffsets.translate !== undefined) {
        if (!Array.isArray(component.npcData.pickerOffsets.translate) ||
            component.npcData.pickerOffsets.translate.length !== 3) {
          console.error('pickerOffsets.translate must be an array of 3 numbers');

          return undefined;
        }
        for (const num of component.npcData.pickerOffsets.translate) {
          if (!validateNumber(num, 'pickerOffsets.translate', -Number.MAX_VALUE, Number.MAX_VALUE)) {
            return undefined;
          }
        }
        pickerOffsets.translate = component.npcData.pickerOffsets.translate;
      }

      // Validate picker scale
      if (component.npcData.pickerOffsets.scale !== undefined) {
        if (!Array.isArray(component.npcData.pickerOffsets.scale) ||
            component.npcData.pickerOffsets.scale.length !== 3) {
          console.error('pickerOffsets.scale must be an array of 3 numbers');

          return undefined;
        }
        for (const num of component.npcData.pickerOffsets.scale) {
          if (!validateNumber(num, 'pickerOffsets.scale', 0, Number.MAX_VALUE)) {
            return undefined;
          }
        }
        pickerOffsets.scale = component.npcData.pickerOffsets.scale;
      }

      npcData.picker_offsets = pickerOffsets;
    }

    // Validate skinList
    if (component.npcData.skinList !== undefined) {
      if (!Array.isArray(component.npcData.skinList)) {
        console.error('skinList must be an array');

        return undefined;
      }

      const skinList = component.npcData.skinList.map((skin, index) => {
        const skinData: any = {};

        // Validate variant
        if (skin.variant !== undefined) {
          if (!validateNumber(skin.variant, `skinList[${index}].variant`, 0, Number.MAX_SAFE_INTEGER)) {
            return undefined;
          }
          skinData.variant = skin.variant;
        }

        // Validate markVariant
        if (skin.markVariant !== undefined) {
          if (!validateNumber(skin.markVariant, `skinList[${index}].markVariant`, 0, Number.MAX_SAFE_INTEGER)) {
            return undefined;
          }
          skinData.mark_variant = skin.markVariant;
        }

        return skinData;
      });

      if (skinList.includes(undefined)) {
        return undefined;
      }

      npcData.skin_list = skinList;
    }

    result.npc_data = npcData;
  }

  return {
    'minecraft:npc': result
  };
};
