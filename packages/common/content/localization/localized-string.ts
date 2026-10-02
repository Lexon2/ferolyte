/**
 * Locale code such as `en_US` or `ru_RU`.
 */
export type Locale = string;

/**
 * Text shown to players. A plain string uses the default locale
 * (`packs.lang.defaultLocale`), a record maps locale codes to translations.
 * The text is written to `texts/<locale>.lang` automatically.
 */
export type LocalizedString = string | Record<Locale, string>;

/**
 * Whether the value has at least one non-empty text.
 */
export const isValidLocalizedString = (value: unknown): value is LocalizedString => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const entries = Object.entries(value);

  return (
    entries.length > 0 &&
    entries.every(
      ([locale, text]) =>
        locale.length > 0 && typeof text === 'string' && text.trim().length > 0,
    )
  );
};

/**
 * Normalizes a localized string to a `locale -> text` record.
 */
export const toTranslations = (
  value: LocalizedString,
  defaultLocale: Locale,
): Record<Locale, string> =>
  typeof value === 'string' ? { [defaultLocale]: value } : { ...value };

/**
 * Vanilla language keys.
 */
export const LANG_KEYS = {
  item: (identifier: string) => `item.${identifier}`,
  block: (identifier: string) => `tile.${identifier}.name`,
  entity: (identifier: string) => `entity.${identifier}.name`,
  spawnEgg: (identifier: string) => `item.spawn_egg.entity.${identifier}.name`,
};
