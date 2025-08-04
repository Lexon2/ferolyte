export interface RingBufferQueue<T> {
  enqueue: (item: T) => boolean;
  dequeue: () => T | undefined;
  length: number;
}

/**
 * createRingBufferQueue creates a new ring buffer queue with the given capacity.
 *
 * @description Ring buffer queue is a queue that uses a ring buffer to store the items.
 * It's extremely efficient for large queues. However it uses more memory than the ArrayQueue.
 *
 * @param capacity - The maximum number of items the queue can hold.
 * @returns A new ring buffer queue.
 *
 * @example
 * const queue = createRingBufferQueue<number>(1000);
 * queue.enqueue(1);
 * queue.enqueue(2);
 * queue.enqueue(3);
 * queue.dequeue(); // 1
 * queue.length; // 2
 */
export function createRingBufferQueue<T>(capacity: number): RingBufferQueue<T> {
  const buffer = new Array(capacity);

  let head = 0;
  let tail = 0;
  let size = 0;

  return {
    enqueue: (item: T) => {
      if (size === capacity) return false;
      buffer[tail] = item;
      tail = (tail + 1) % capacity;
      size++;

      return true;
    },
    dequeue: () => {
      if (size === 0) return undefined;
      const item = buffer[head];
      buffer[head] = undefined;
      head = (head + 1) % capacity;
      size--;

      return item;
    },
    get length() {
      return size;
    },
  };
}
