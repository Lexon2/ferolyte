import { StateObject } from '@artifex/pack/content/common/interfaces/state-object';

/**
 * Causes the entity's body to always be automatically rotated to align with the entity's head.
 * Does not override the "minecraft:body_rotation_blocked" component.
 */
export interface BodyRotationAlwaysFollowsHeadComponent extends StateObject {}
