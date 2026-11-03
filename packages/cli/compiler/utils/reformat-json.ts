import { SyntaxKind, createScanner } from 'jsonc-parser';

/**
 * Re-prints valid JSON(C) text token by token: comments and trailing commas are dropped, whitespace is replaced by
 * `JSON.stringify`'s layout (`indent` spaces, or none). Literals are copied verbatim, so `0.0` stays `0.0`: parsing
 * and re-stringifying would write `0`, and Minecraft rejects an integer where a float is required (entity property
 * `default`). The text must already be valid (see `parseJsonc`).
 */
export const reformatJson = (text: string, indent?: number): string => {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const scanner = createScanner(source, true);
  const tokens: { kind: SyntaxKind; text: string }[] = [];
  for (let kind = scanner.scan(); kind !== SyntaxKind.EOF; kind = scanner.scan()) {
    tokens.push({
      kind,
      text: source.substr(scanner.getTokenOffset(), scanner.getTokenLength()),
    });
  }

  const isClose = (kind: SyntaxKind | undefined) =>
    kind === SyntaxKind.CloseBraceToken || kind === SyntaxKind.CloseBracketToken;
  const pretty = indent !== undefined && indent > 0;
  let depth = 0;
  let out = '';
  const newline = () => {
    if (pretty) {
      out += `\n${' '.repeat(indent * depth)}`;
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const { kind, text: token } = tokens[i];
    switch (kind) {
      case SyntaxKind.OpenBraceToken:
      case SyntaxKind.OpenBracketToken:
        out += token;
        if (isClose(tokens[i + 1]?.kind)) {
          out += tokens[++i].text;
        } else {
          depth++;
          newline();
        }
        break;
      case SyntaxKind.CloseBraceToken:
      case SyntaxKind.CloseBracketToken:
        depth--;
        newline();
        out += token;
        break;
      case SyntaxKind.CommaToken:
        // Trailing comma (JSONC): dropped.
        if (!isClose(tokens[i + 1]?.kind)) {
          out += ',';
          newline();
        }
        break;
      case SyntaxKind.ColonToken:
        out += pretty ? ': ' : ':';
        break;
      default:
        out += token;
    }
  }

  return out;
};
