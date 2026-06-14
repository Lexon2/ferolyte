export const CONTENT_METADATA = {
  UNKNOWN: 'artifex-pack:unknown',
  ITEM: 'artifex-pack:item',
  BLOCK: 'artifex-pack:block',
  SERVER_ENTITY: 'artifex-pack:server-entity',
  CLIENT_ENTITY: 'artifex-pack:client-entity',
} as const;

export type ContentMetadata =
  (typeof CONTENT_METADATA)[keyof typeof CONTENT_METADATA];
