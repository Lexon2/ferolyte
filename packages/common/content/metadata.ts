export const CONTENT_METADATA = {
  UNKNOWN: 'ferolyte-pack:unknown',
  ITEM: 'ferolyte-pack:item',
  BLOCK: 'ferolyte-pack:block',
  SERVER_ENTITY: 'ferolyte-pack:server-entity',
  CLIENT_ENTITY: 'ferolyte-pack:client-entity',
  ATTACHABLE: 'ferolyte-pack:attachable',
  RENDER_CONTROLLER: 'ferolyte-pack:render-controller',
  RECIPE: 'ferolyte-pack:recipe',
  SPAWN_RULE: 'ferolyte-pack:spawn-rule',
  ANIMATION_CONTROLLER_BP: 'ferolyte-pack:animation-controller-bp',
  ANIMATION_CONTROLLER_RP: 'ferolyte-pack:animation-controller-rp',
} as const;

export type ContentMetadata =
  (typeof CONTENT_METADATA)[keyof typeof CONTENT_METADATA];
