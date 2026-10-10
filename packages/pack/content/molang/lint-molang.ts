const STRING_LITERAL = /'[^']*'/g;

/** `!` + a bare operand (variable/query path, optionally called, or a number) + a comparison. */
const NEGATED_COMPARISON =
  /(^|[^\w.)\]!=<>])!\s*([A-Za-z_]\w*(?:\.\w+)*(?:\s*\([^()]*\))?|\d+(?:\.\d+)?)\s*(==|!=|<=|>=|<|>)/g;

/**
 * Molang mistakes that the game loads without a ContentLog error but that never do what was meant.
 * Returns one message per finding (empty when the expression looks fine).
 *
 * - `!` binds tighter than comparisons: `!v.a == 'x'` is `(!v.a) == 'x'`, almost always false.
 * - `!` applied to a string literal (`!'v.a == 1'`, what `not('v.a == 1')` writes) is always false.
 */
export const lintMolang = (source: string): string[] => {
  const messages: string[] = [];

  for (const match of source.matchAll(STRING_LITERAL)) {
    const before = source.slice(0, match.index).trimEnd();
    if (before.endsWith('!') && !before.endsWith('!!')) {
      messages.push(
        `\`!\` is applied to the string literal ${match[0]}, which is always false. A plain string passed to ` +
          "`not()` or interpolated into `molang` is a Molang string; wrap Molang source in `raw()` (`not(raw('v.a == 1'))`)",
      );
    }
  }

  // Blank out string contents so their text is not read as operators.
  const masked = source.replace(
    STRING_LITERAL,
    (literal) => `'${' '.repeat(literal.length - 2)}'`,
  );
  for (const match of masked.matchAll(NEGATED_COMPARISON)) {
    const [, , operand, operator] = match;
    messages.push(
      `\`!\` binds tighter than \`${operator}\`: \`!${operand} ${operator} …\` compares the negation of ${operand}. ` +
        `Write \`!(${operand} ${operator} …)\` (or \`not(...)\` around the comparison)`,
    );
  }

  return messages;
};
