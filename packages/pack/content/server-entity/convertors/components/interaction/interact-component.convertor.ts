import { withFieldPath, ContentDiagnosticContext } from '@artifex/common/content/diagnostics/content-diagnostic';
import {
  InteractComponent,
  InteractComponentInteraction,
} from '../../../interfaces/components/interaction/interact-component';
import { convertTrigger } from '../../common/trigger.convertor';
import {
  validateString,
  validateNumberRange,
  validateBoolean,
  validateSoundEvent,
} from '../../common/validation';

/**
 * Converts an InteractComponent to Minecraft format
 * @param component The component to convert
 * @returns The component in Minecraft format or undefined if validation fails
 */
export const convertInteractComponent = (
  component: Partial<InteractComponent>,
  ctx?: ContentDiagnosticContext
): { 'minecraft:interact': any } | undefined => {
  if (!component) {
    return undefined;
  }

  const result: any = {};

  // Validate interactions if present
  if (component.interactions !== undefined) {
    if (!Array.isArray(component.interactions)) {
      console.error('interactions must be an array');

      return undefined;
    }

    result.interactions = component.interactions
      .map((interaction: InteractComponentInteraction) => {
        const interactionResult: any = {};

        // Validate addItems
        if (interaction.addItems !== undefined) {
          if (
            typeof interaction.addItems !== 'object' ||
            interaction.addItems === null
          ) {
            console.error('addItems must be an object');

            return undefined;
          }
          if (!validateString(interaction.addItems.table, 'table')) {
            return undefined;
          }
          interactionResult.add_items = {
            table: interaction.addItems.table,
          };
        }

        // Validate cooldown
        if (interaction.cooldown !== undefined) {
          if (
            !validateNumberRange(
              interaction.cooldown,
              0,
              Number.MAX_VALUE,
              'cooldown',
            )
          ) {
            return undefined;
          }
          interactionResult.cooldown = interaction.cooldown;
        }

        // Validate admire
        if (interaction.admire !== undefined) {
          if (!validateBoolean(interaction.admire, 'admire')) {
            return undefined;
          }
          interactionResult.admire = interaction.admire;
        }

        // Validate barter
        if (interaction.barter !== undefined) {
          if (!validateBoolean(interaction.barter, 'barter')) {
            return undefined;
          }
          interactionResult.barter = interaction.barter;
        }

        // Validate cooldownAfterBeingAttacked
        if (interaction.cooldownAfterBeingAttacked !== undefined) {
          if (
            !validateNumberRange(
              interaction.cooldownAfterBeingAttacked,
              0,
              Number.MAX_VALUE,
              'cooldownAfterBeingAttacked',
            )
          ) {
            return undefined;
          }
          interactionResult.cooldown_after_being_attacked =
            interaction.cooldownAfterBeingAttacked;
        }

        // Validate healthAmount
        if (interaction.healthAmount !== undefined) {
          if (
            !validateNumberRange(
              interaction.healthAmount,
              0,
              Number.MAX_SAFE_INTEGER,
              'healthAmount',
            )
          ) {
            return undefined;
          }
          interactionResult.health_amount = interaction.healthAmount;
        }

        // Validate hurtItem
        if (interaction.hurtItem !== undefined) {
          if (
            !validateNumberRange(
              interaction.hurtItem,
              0,
              Number.MAX_SAFE_INTEGER,
              'hurtItem',
            )
          ) {
            return undefined;
          }
          interactionResult.hurt_item = interaction.hurtItem;
        }

        // Validate interactText
        if (interaction.interactText !== undefined) {
          if (!validateString(interaction.interactText, 'interactText')) {
            return undefined;
          }
          interactionResult.interact_text = interaction.interactText;
        }

        // Validate onInteract
        if (interaction.onInteract !== undefined) {
          const convertedOnInteract = convertTrigger(interaction.onInteract, withFieldPath(ctx, 'onInteract'));
          if (!convertedOnInteract) {
            return undefined;
          }
          interactionResult.on_interact = convertedOnInteract;
        }

        // Validate particleOnStart
        if (interaction.particleOnStart !== undefined) {
          if (
            typeof interaction.particleOnStart !== 'object' ||
            interaction.particleOnStart === null
          ) {
            console.error('particleOnStart must be an object');

            return undefined;
          }

          const particleResult: any = {};

          if (
            interaction.particleOnStart.particleOffsetTowardsInteractor !==
            undefined
          ) {
            if (
              !validateBoolean(
                interaction.particleOnStart.particleOffsetTowardsInteractor,
                'particleOffsetTowardsInteractor',
              )
            ) {
              return undefined;
            }
            particleResult.particle_offset_towards_interactor =
              interaction.particleOnStart.particleOffsetTowardsInteractor;
          }

          if (interaction.particleOnStart.particleType !== undefined) {
            if (
              !validateString(
                interaction.particleOnStart.particleType,
                'particleType',
              )
            ) {
              return undefined;
            }
            particleResult.particle_type =
              interaction.particleOnStart.particleType;
          }

          if (interaction.particleOnStart.particleYOffset !== undefined) {
            if (
              typeof interaction.particleOnStart.particleYOffset !== 'number'
            ) {
              console.error('particleYOffset must be a number');

              return undefined;
            }
            particleResult.particle_y_offset =
              interaction.particleOnStart.particleYOffset;
          }

          interactionResult.particle_on_start = particleResult;
        }

        // Validate playSounds
        if (interaction.playSounds !== undefined) {
          if (!validateSoundEvent(interaction.playSounds, 'playSounds')) {
            return undefined;
          }
          interactionResult.play_sounds = interaction.playSounds;
        }

        // Validate spawnEntities
        if (interaction.spawnEntities !== undefined) {
          if (!validateString(interaction.spawnEntities, 'spawnEntities')) {
            return undefined;
          }
          interactionResult.spawn_entities = interaction.spawnEntities;
        }

        // Validate spawnItems
        if (interaction.spawnItems !== undefined) {
          if (
            typeof interaction.spawnItems !== 'object' ||
            interaction.spawnItems === null
          ) {
            console.error('spawnItems must be an object');

            return undefined;
          }
          if (!validateString(interaction.spawnItems.table, 'table')) {
            return undefined;
          }
          interactionResult.spawn_items = {
            table: interaction.spawnItems.table,
          };
        }

        // Validate swing
        if (interaction.swing !== undefined) {
          if (!validateBoolean(interaction.swing, 'swing')) {
            return undefined;
          }
          interactionResult.swing = interaction.swing;
        }

        // Validate transformToItem
        if (interaction.transformToItem !== undefined) {
          if (!validateString(interaction.transformToItem, 'transformToItem')) {
            return undefined;
          }
          interactionResult.transform_to_item = interaction.transformToItem;
        }

        // Validate useItem
        if (interaction.useItem !== undefined) {
          if (!validateBoolean(interaction.useItem, 'useItem')) {
            return undefined;
          }
          interactionResult.use_item = interaction.useItem;
        }

        // Validate vibration
        if (interaction.vibration !== undefined) {
          if (
            ![
              'none',
              'shear',
              'entity_die',
              'entity_act',
              'entity_interact',
            ].includes(interaction.vibration)
          ) {
            console.error(
              'vibration must be one of: none, shear, entity_die, entity_act, entity_interact',
            );

            return undefined;
          }
          interactionResult.vibration = interaction.vibration;
        }

        // Validate giveItem
        if (interaction.giveItem !== undefined) {
          if (!validateBoolean(interaction.giveItem, 'giveItem')) {
            return undefined;
          }
          interactionResult.give_item = interaction.giveItem;
        }

        // Validate takeItem
        if (interaction.takeItem !== undefined) {
          if (!validateBoolean(interaction.takeItem, 'takeItem')) {
            return undefined;
          }
          interactionResult.take_item = interaction.takeItem;
        }

        // Validate dropItemSlot
        if (interaction.dropItemSlot !== undefined) {
          if (!validateString(interaction.dropItemSlot, 'dropItemSlot')) {
            return undefined;
          }
          interactionResult.drop_item_slot = interaction.dropItemSlot;
        }

        // Validate dropItemYOffset
        if (interaction.dropItemYOffset !== undefined) {
          if (typeof interaction.dropItemYOffset !== 'number') {
            console.error('dropItemYOffset must be a number');

            return undefined;
          }
          interactionResult.drop_item_y_offset = interaction.dropItemYOffset;
        }

        // Validate equipItemSlot
        if (interaction.equipItemSlot !== undefined) {
          if (!validateString(interaction.equipItemSlot, 'equipItemSlot')) {
            return undefined;
          }
          interactionResult.equip_item_slot = interaction.equipItemSlot;
        }

        // Validate repairEntityItem
        if (interaction.repairEntityItem !== undefined) {
          if (
            typeof interaction.repairEntityItem !== 'object' ||
            interaction.repairEntityItem === null
          ) {
            console.error('repairEntityItem must be an object');

            return undefined;
          }
          if (
            !validateNumberRange(
              interaction.repairEntityItem.amount,
              0,
              Number.MAX_SAFE_INTEGER,
              'amount',
            )
          ) {
            return undefined;
          }
          if (!validateString(interaction.repairEntityItem.slot, 'slot')) {
            return undefined;
          }
          interactionResult.repair_entity_item = {
            amount: interaction.repairEntityItem.amount,
            slot: interaction.repairEntityItem.slot,
          };
        }

        return interactionResult;
      })
      .filter(Boolean);
  }

  return {
    'minecraft:interact': result,
  };
};
