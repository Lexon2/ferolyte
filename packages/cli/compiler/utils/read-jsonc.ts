import { readFile } from 'fs/promises';
import {
  ParseError,
  parse,
  printParseErrorCode,
} from 'jsonc-parser';

export interface JsoncDiagnostic {
  message: string;
  line: number;
  column: number;
  lineText: string;
  length: number;
}

export type JsoncParseResult =
  | { ok: true; value: unknown }
  | { ok: false; errors: JsoncDiagnostic[] };

const toDiagnostic = (text: string, error: ParseError): JsoncDiagnostic => {
  const before = text.slice(0, error.offset).split(/\r?\n/);
  const line = before.length;
  const column = before[before.length - 1].length;
  const lineText = text.split(/\r?\n/)[line - 1] ?? '';

  return {
    message: printParseErrorCode(error.error),
    line,
    column,
    lineText,
    length: Math.max(error.length, 1),
  };
};

export const parseJsonc = (text: string): JsoncParseResult => {
  // Fast path: most pack files are strict JSON, and the native parser is many times faster than jsonc-parser.
  // For strict JSON both give the same value (same key order, last duplicate wins). `__proto__` keys are the
  // exception (an own key for JSON.parse, the prototype for jsonc-parser), so such text keeps the slow path.
  if (!text.includes('__proto__')) {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch {
      // comments, trailing commas or a real error: jsonc-parser decides
    }
  }

  const errors: ParseError[] = [];
  const value = parse(text, errors, { allowTrailingComma: true });

  if (errors.length > 0) {
    return { ok: false, errors: errors.map((e) => toDiagnostic(text, e)) };
  }

  return { ok: true, value };
};

export const readJsonc = async <T = unknown>(path: string): Promise<T> => {
  const text = await readFile(path, 'utf-8');
  const result = parseJsonc(text);

  if (!result.ok) {
    const [first] = result.errors;
    throw new Error(
      `${path}:${first.line}:${first.column + 1}: ${first.message}`,
    );
  }

  return result.value as T;
};
