// Shared TypeScript-compiler-API helpers for the schema tooling:
// enumerates SDK component config types and synthesizes "full" configs from them.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

export const PACK = path.join(ROOT, 'packages/pack');
const MAX_DEPTH = 7;

export const SOURCES = {
  entity: ['content/server-entity/interfaces/entity-components.ts', 'EntityComponents'],
  item: ['content/item/interfaces/item-config.ts', 'ItemComponents'],
  block: ['content/block/interfaces/block-config.ts', 'BlockComponents'],
};

export const snake = (s) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

export function createProgram() {
  const configPath = path.join(PACK, 'tsconfig.json');
  const cfg = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, PACK);
  const files = Object.values(SOURCES).map(([f]) => path.join(PACK, f));

  return ts.createProgram(files, { ...parsed.options, noEmit: true });
}

/**
 * @returns {{ kind: string, key: string, required: string[], config: unknown }[]}
 *   kind ∈ entity | entity_behavior | item | block
 */
export function loadComponents() {
  const program = createProgram();
  const checker = program.getTypeChecker();
  const out = [];

  const synth = createSynth(checker);

  const declared = (kind) => {
    const [file, name] = SOURCES[kind];
    const sf = program.getSourceFile(path.join(PACK, file));
    const sym = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)).find((s) => s.name === name);

    return checker.getDeclaredTypeOfSymbol(sym);
  };

  const push = (kind, holder, nodeSource) => {
    for (const prop of checker.getPropertiesOfType(holder)) {
      const type = checker.getNonNullableType(
        checker.getTypeOfSymbolAtLocation(prop, nodeSource),
      );
      out.push({
        kind,
        key: prop.name,
        required: requiredOf(checker, type, nodeSource),
        config: synth(type, 0, new Set()),
      });
    }
  };

  for (const kind of ['entity', 'item', 'block']) {
    const holder = declared(kind);
    const decl = holder.symbol.declarations[0];
    const props = checker.getPropertiesOfType(holder);

    for (const prop of props) {
      const type = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, decl));
      if (kind === 'entity' && prop.name === 'behaviors') {
        push('entity_behavior', type, decl);
        continue;
      }
      out.push({
        kind,
        key: prop.name,
        required: requiredOf(checker, type, decl),
        config: synth(type, 0, new Set()),
      });
    }
  }

  return out;
}

function requiredOf(checker, type, node) {
  if (type.isUnion()) return [];
  if (!(type.flags & ts.TypeFlags.Object) || checker.isArrayType(type)) return [];

  return checker
    .getPropertiesOfType(type)
    .filter((p) => !(p.flags & ts.SymbolFlags.Optional))
    .map((p) => p.name);
}

function createSynth(checker) {
  const synth = (type, depth, seen) => {
    const f = type.flags;

    if (f & ts.TypeFlags.Any || f & ts.TypeFlags.Unknown) return 'test';
    if (f & ts.TypeFlags.StringLiteral) return type.value;
    if (f & ts.TypeFlags.NumberLiteral) return type.value;
    if (f & ts.TypeFlags.BooleanLiteral) return type.intrinsicName === 'true';
    if (f & ts.TypeFlags.String) return 'test';
    if (f & ts.TypeFlags.Number) return 1;
    if (f & ts.TypeFlags.Boolean) return true;
    if (f & ts.TypeFlags.TemplateLiteral) {
      return type.texts.reduce(
        (acc, t, i) => acc + t + (i < type.types.length ? 'test' : ''),
        '',
      );
    }
    if (f & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)) return undefined;

    if (type.isUnion()) {
      const members = type.types.filter(
        (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
      );
      // booleans are expanded to true|false: collapse
      if (members.every((t) => t.flags & ts.TypeFlags.BooleanLiteral)) return true;
      // prefer plain-data members over class instances such as Molang
      const ordered = [...members].sort((a, b) => rank(a) - rank(b));
      for (const m of ordered) {
        const v = synth(m, depth, seen);
        if (v !== undefined) return v;
      }

      return undefined;
    }

    if (type.isIntersection()) {
      const parts = type.types.map((t) => synth(t, depth, seen));
      if (parts.every((p) => p && typeof p === 'object' && !Array.isArray(p))) {
        return Object.assign({}, ...parts);
      }

      return parts.find((p) => p !== undefined);
    }

    if (!(f & ts.TypeFlags.Object)) return undefined;

    const symName = type.symbol?.name;
    if (symName === 'Molang') return 'true';
    if (type.getCallSignatures().length > 0) return undefined;

    if (checker.isTupleType(type)) {
      return checker.getTypeArguments(type).map((t) => synth(t, depth + 1, seen));
    }
    if (checker.isArrayType(type)) {
      if (depth >= MAX_DEPTH) return [];
      const el = synth(checker.getTypeArguments(type)[0], depth + 1, seen);

      return el === undefined ? [] : [el];
    }

    if (depth >= MAX_DEPTH || seen.has(type)) return undefined;
    seen.add(type);

    const result = {};
    for (const p of checker.getPropertiesOfType(type)) {
      const pt = checker.getNonNullableType(
        checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration ?? p.declarations?.[0]),
      );
      const v = synth(pt, depth + 1, seen);
      if (v !== undefined) result[p.name] = v;
    }
    const index = checker.getIndexInfosOfType(type)[0];
    if (index && Object.keys(result).length === 0) {
      const v = synth(index.type, depth + 1, seen);
      if (v !== undefined) result.test = v;
    }
    seen.delete(type);

    return result;
  };

  return synth;
}

function rank(t) {
  if (t.symbol?.name === 'Molang') return 3;
  if (t.flags & ts.TypeFlags.Object) return 2;

  return 1;
}
