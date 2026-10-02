/**
 * String that suggests known values in autocomplete but accepts any string.
 */
export type LooseString<T extends string> = T | (string & {});
