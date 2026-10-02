export const CONTENT_METADATA = {
  UNKNOWN: 'ferolyte-pack:unknown',
  ITEM: 'ferolyte-pack:item',
  BLOCK: 'ferolyte-pack:block',
  SERVER_ENTITY: 'ferolyte-pack:server-entity',
  CLIENT_ENTITY: 'ferolyte-pack:client-entity',
  ANIMATION_CONTROLLER_BP: 'ferolyte-pack:animation-controller-bp',
  ANIMATION_CONTROLLER_RP: 'ferolyte-pack:animation-controller-rp',
} as const;

export type ContentMetadata =
  (typeof CONTENT_METADATA)[keyof typeof CONTENT_METADATA];
