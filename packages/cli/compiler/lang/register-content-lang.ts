import {
  LANG_KEYS,
  LocalizedString,
} from '@ferolyte/common/content/localization/localized-string';
import { addSourceLang } from './lang-registry';

export const registerItemLang = (
  source: string,
  identifier: string | undefined,
  displayName: LocalizedString | undefined,
) => {
  if (identifier !== undefined) {
    addSourceLang(source, LANG_KEYS.item(identifier), displayName);
  }
};

export const registerBlockLang = (
  source: string,
  identifier: string | undefined,
  displayName: LocalizedString | undefined,
) => {
  if (identifier !== undefined) {
    addSourceLang(source, LANG_KEYS.block(identifier), displayName);
  }
};

export const registerServerEntityLang = (
  source: string,
  identifier: string | undefined,
  displayName: LocalizedString | undefined,
) => {
  if (identifier !== undefined) {
    addSourceLang(source, LANG_KEYS.entity(identifier), displayName);
    addSourceLang(source, LANG_KEYS.spawnEgg(identifier), displayName);
  }
};
