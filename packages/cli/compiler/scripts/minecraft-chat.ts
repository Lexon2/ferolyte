import type { MinecraftChatMessage } from '../plugins/types';

const FORMAT_CODES = /§./g;

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

/** Flattens one rawtext component to plain text. */
const flattenComponent = (component: unknown): string => {
  if (typeof component === 'string') {
    return component;
  }
  const item = asRecord(component);
  if (!item) {
    return '';
  }

  if (typeof item.text === 'string') {
    return item.text;
  }
  if (typeof item.translate === 'string') {
    const withList = Array.isArray(item.with)
      ? item.with
      : asRecord(item.with)?.rawtext;
    const args = Array.isArray(withList) ? withList.map(flattenComponent) : [];
    let index = 0;

    return item.translate.replace(/%(?:(\d+)\$)?s/g, (_, position?: string) =>
      position !== undefined ? (args[Number(position) - 1] ?? '') : (args[index++] ?? ''),
    ) || item.translate;
  }
  if (typeof item.selector === 'string') {
    return item.selector;
  }
  const score = asRecord(item.score);
  if (score) {
    return String(score.value ?? score.name ?? '');
  }
  if (Array.isArray(item.rawtext)) {
    return item.rawtext.map(flattenComponent).join('');
  }

  return '';
};

/**
 * Plain text of a chat message: a string, a JSON `rawtext` string, or a rawtext object / array,
 * with `§` formatting codes removed.
 */
export const flattenChatText = (message: unknown): string => {
  let value: unknown = message;
  if (typeof value === 'string' && /^\s*[{[]/.test(value)) {
    try {
      value = JSON.parse(value);
    } catch {
      // not JSON: plain text that starts with a bracket
    }
  }

  const text = Array.isArray(value)
    ? value.map(flattenComponent).join('')
    : asRecord(value) && Array.isArray(asRecord(value)?.rawtext)
      ? (asRecord(value)?.rawtext as unknown[]).map(flattenComponent).join('')
      : flattenComponent(value);

  return text.replace(FORMAT_CODES, '');
};

/**
 * Normalises a `PlayerMessage` event body. Both shapes are handled:
 * `{ message, sender, type }` and `{ properties: { Message, Sender, MessageType } }`.
 */
export const normalizeChatBody = (
  clientId: number,
  body: unknown,
): MinecraftChatMessage | undefined => {
  const data = asRecord(body);
  if (!data) {
    return undefined;
  }
  const properties = asRecord(data.properties);
  const message = data.message ?? properties?.Message;
  if (message === undefined) {
    return undefined;
  }

  return {
    clientId,
    sender: String(data.sender ?? properties?.Sender ?? '').replace(FORMAT_CODES, ''),
    type: String(data.type ?? properties?.MessageType ?? properties?.Type ?? ''),
    text: flattenChatText(message),
  };
};
