export interface ArrayQueue<T> {
  length: number;
  isEmpty: () => boolean;
  enqueue: (item: T) => boolean;
  dequeue: () => T | undefined;
  remove: (item: T) => void;
}

/**
 * ArrayQueue is a simple queue implementation that uses an array to store the items.
 *
 * It's efficient for small queues under 1000 items.
 *
 * @example
 * const queue = new ArrayQueue<number>();
 * queue.enqueue(1);
 * queue.enqueue(2);
 * queue.enqueue(3);
 */
export function createArrayQueue<T>(): ArrayQueue<T> {
  const items: T[] = [];

  return {
    get length() {
      return items.length;
    },
    isEmpty: () => items.length === 0,
    enqueue: (item: T) => {
      items.push(item);

      return true;
    },
    dequeue: () => items.shift(),
    remove: (item: T) => {
      const index = items.indexOf(item);
      if (index > -1) {
        items.splice(index, 1);
      }
    },
  };
}
