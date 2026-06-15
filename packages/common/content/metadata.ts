export const CONTENT_METADATA = {
  UNKNOWN: 'ferolyte-pack:unknown',
  ITEM: 'ferolyte-pack:item',
  BLOCK: 'ferolyte-pack:block',
  SERVER_ENTITY: 'ferolyte-pack:server-entity',
  CLIENT_ENTITY: 'ferolyte-pack:client-entity',
} as const;

export type ContentMetadata =
  (typeof CONTENT_METADATA)[keyof typeof CONTENT_METADATA];
