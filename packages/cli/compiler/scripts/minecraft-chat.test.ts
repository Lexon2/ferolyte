import { describe, expect, it } from 'vitest';

import { flattenChatText, normalizeChatBody } from './minecraft-chat';

describe('flattenChatText', () => {
  it('handles plain strings and strips formatting codes', () => {
    expect(flattenChatText('hello')).toBe('hello');
    expect(flattenChatText('§l§cred§r text')).toBe('red text');
    expect(flattenChatText('[not json] still text')).toBe('[not json] still text');
  });

  it('flattens rawtext arrays and objects (string or parsed)', () => {
    const rawtext = { rawtext: [{ text: 'a' }, { text: 'b' }] };

    expect(flattenChatText(rawtext)).toBe('ab');
    expect(flattenChatText(JSON.stringify(rawtext))).toBe('ab');
    expect(flattenChatText([{ text: '§aone' }, 'two'])).toBe('onetwo');
  });

  it('flattens translate (with arguments), selector and score fallbacks', () => {
    expect(
      flattenChatText({ rawtext: [{ translate: 'chat.type.text', with: ['Steve', 'hi'] }] }),
    ).toBe('chat.type.text');
    expect(
      flattenChatText({ rawtext: [{ translate: '<%s> %s', with: ['Steve', 'hi'] }] }),
    ).toBe('<Steve> hi');
    expect(
      flattenChatText({ rawtext: [{ translate: '%2$s %1$s', with: { rawtext: [{ text: 'a' }, { text: 'b' }] } }] }),
    ).toBe('b a');
    expect(flattenChatText({ rawtext: [{ selector: '@a[tag=x]' }, { score: { name: 'Steve', objective: 'o' } }] })).toBe(
      '@a[tag=x]Steve',
    );
  });
});

describe('normalizeChatBody', () => {
  it('accepts the message/sender/type body', () => {
    expect(normalizeChatBody(3, { message: 'hi', sender: '§aSteve', type: 'chat' })).toEqual({
      clientId: 3,
      sender: 'Steve',
      type: 'chat',
      text: 'hi',
    });
  });

  it('accepts the properties.Message / properties.Sender body', () => {
    expect(
      normalizeChatBody(1, { properties: { Message: 'yo', Sender: 'Alex', MessageType: 'say' } }),
    ).toEqual({ clientId: 1, sender: 'Alex', type: 'say', text: 'yo' });
  });

  it('ignores bodies without a message', () => {
    expect(normalizeChatBody(1, { sender: 'x' })).toBeUndefined();
    expect(normalizeChatBody(1, undefined)).toBeUndefined();
  });
});
