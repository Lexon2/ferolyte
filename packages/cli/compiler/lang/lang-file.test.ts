import { describe, expect, it } from 'vitest';

import { GENERATED_SECTION_HEADER, mergeLang, parseLangKeys } from './lang-file';

describe('parseLangKeys', () => {
  it('skips comments and blank lines', () => {
    const keys = parseLangKeys('## c\n// c\n\na.b=1\r\nc = 2\t#note\n');

    expect([...keys]).toEqual(['a.b', 'c']);
  });
});

describe('mergeLang', () => {
  it('returns only the generated section without a user file', () => {
    const { text } = mergeLang(undefined, new Map([['b', '2'], ['a', '1']]));

    expect(text).toBe(`${GENERATED_SECTION_HEADER}\na=1\nb=2\n`);
  });

  it('keeps user lines and comments, appends generated section', () => {
    const user = '## my names\nitem.x=Mine\n\n// tail\n';
    const { text, conflicts } = mergeLang(user, new Map([['item.y', 'Gen']]));

    expect(conflicts).toEqual([]);
    expect(text).toBe(
      `## my names\nitem.x=Mine\n\n// tail\n\n${GENERATED_SECTION_HEADER}\nitem.y=Gen\n`,
    );
  });

  it('user value wins on conflict', () => {
    const { text, conflicts } = mergeLang(
      'item.x=Mine\n',
      new Map([['item.x', 'Gen']]),
    );

    expect(conflicts).toEqual(['item.x']);
    expect(text).toBe('item.x=Mine\n');
  });

  it('escapes newlines in generated text', () => {
    const { text } = mergeLang(undefined, new Map([['a', 'x\ny']]));

    expect(text).toContain('a=x\\ny');
  });

  it('returns empty text when there is nothing to write', () => {
    expect(mergeLang(undefined, new Map()).text).toBe('');
  });
});
