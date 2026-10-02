export const GENERATED_SECTION_HEADER = '## ferolyte (generated, do not edit)';

export interface MergeLangResult {
  text: string;
  /** Generated keys that the user file already defines (the user value wins). */
  conflicts: string[];
}

const KEY_PATTERN = /^([^#/=\s][^=]*?)\s*=/;

/**
 * Keys defined in a `.lang` text. Comments (`##`, `//`) and blank lines are skipped.
 */
export const parseLangKeys = (text: string): Set<string> => {
  const keys = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const match = KEY_PATTERN.exec(line);
    if (match) {
      keys.add(match[1]);
    }
  }

  return keys;
};

/**
 * Merges generated entries into the user's `.lang` text. The user text is kept
 * untouched (order, comments); generated entries are appended in a
 * `## ferolyte` section, user lines win on conflict.
 * @param userText - Content of the user's `texts/<locale>.lang`, if any.
 * @param generated - Generated `key -> text` entries.
 */
export const mergeLang = (
  userText: string | undefined,
  generated: ReadonlyMap<string, string>,
): MergeLangResult => {
  const base = (userText ?? '').replace(/\r\n/g, '\n').replace(/\n+$/, '');
  const userKeys = parseLangKeys(base);
  const conflicts: string[] = [];
  const lines: string[] = [];

  for (const key of [...generated.keys()].sort()) {
    if (userKeys.has(key)) {
      conflicts.push(key);
      continue;
    }
    const text = (generated.get(key) as string).replace(/\r?\n/g, '\\n');
    lines.push(`${key}=${text}`);
  }

  if (lines.length === 0) {
    return { text: base.length > 0 ? `${base}\n` : '', conflicts };
  }

  const section = `${GENERATED_SECTION_HEADER}\n${lines.join('\n')}\n`;

  return {
    text: base.length > 0 ? `${base}\n\n${section}` : section,
    conflicts,
  };
};
