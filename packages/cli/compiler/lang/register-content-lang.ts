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
  spawnEggName?: LocalizedString,
) => {
  if (identifier !== undefined) {
    addSourceLang(source, LANG_KEYS.entity(identifier), displayName);
    // The spawn egg is named like the entity unless `spawnEggName` says otherwise.
    addSourceLang(source, LANG_KEYS.spawnEgg(identifier), spawnEggName ?? displayName);
  }
};
