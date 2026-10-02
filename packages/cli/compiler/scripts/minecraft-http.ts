import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

import type {
  MinecraftHttpHandler,
  MinecraftHttpResponse,
} from '../plugins/types';
import type { MinecraftHub } from './minecraft-hub';

const MAX_BODY_BYTES = 1024 * 1024;

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const readBody = (req: IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, 'Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf-8');
      if (!text) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(text));
      } catch {
        reject(new HttpError(400, 'Body must be valid JSON'));
      }
    });
    req.on('error', reject);
  });

/** A handler result is a response only if it has nothing but `status` / `body`. */
const isHttpResponse = (value: unknown): value is MinecraftHttpResponse => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const keys = Object.keys(value);
  return (
    keys.length > 0 &&
    keys.every((key) => key === 'status' || key === 'body')
  );
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const requireString = (value: unknown, name: string): string => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new HttpError(400, `"${name}" must be a non-empty string`);
  }
  return value;
};

/** Minimal JSON HTTP API on top of the hub. Loopback only. */
export class MinecraftHttpApi {
  private readonly routes = new Map<string, Map<string, MinecraftHttpHandler>>();
  private server: Server | undefined;

  constructor(private readonly hub: MinecraftHub) {
    this.route('GET', '/status', () => ({
      clients: this.hub.clients,
      inFlight: this.hub.inFlight,
      lastEventSeq: this.hub.lastEventSeq,
    }));
    this.route('POST', '/command', ({ body }) => {
      const data = asRecord(body);
      return this.hub.sendCommand(requireString(data.command, 'command'), {
        timeoutMs: typeof data.timeoutMs === 'number' ? data.timeoutMs : undefined,
      });
    });
    this.route('POST', '/scriptevent', ({ body }) => {
      const data = asRecord(body);
      return this.hub.scriptEvent(
        requireString(data.id, 'id'),
        typeof data.message === 'string' ? data.message : '',
      );
    });
    this.route('GET', '/events', ({ query }) => {
      const since = Number(query.since ?? 0);
      return {
        events: this.hub.eventsSince(Number.isFinite(since) ? since : 0),
        last: this.hub.lastEventSeq,
      };
    });
    this.route('POST', '/subscribe', ({ body }) => {
      this.hub.subscribe(requireString(asRecord(body).eventName, 'eventName'));
      return { ok: true };
    });
  }

  route(method: string, path: string, handler: MinecraftHttpHandler) {
    const key = method.toUpperCase();
    let byPath = this.routes.get(key);
    if (!byPath) {
      byPath = new Map();
      this.routes.set(key, byPath);
    }
    byPath.set(path, handler);
  }

  listen(port: number, host = '127.0.0.1'): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => void this.handle(req, res));
      server.once('error', (error: NodeJS.ErrnoException) =>
        reject(
          error.code === 'EADDRINUSE'
            ? new Error(
                `HTTP port ${port} is already in use. Set "server.http.port" in the profile config.`,
              )
            : error,
        ),
      );
      server.listen(port, host, () => {
        this.server = server;
        resolve();
      });
    });
  }

  get port(): number {
    const address = this.server?.address();
    return typeof address === 'object' && address ? address.port : 0;
  }

  close(): Promise<void> {
    const server = this.server;
    this.server = undefined;
    if (!server) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
  }

  private async handle(req: IncomingMessage, res: ServerResponse) {
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(body ?? null));
    };

    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      const method = (req.method ?? 'GET').toUpperCase();
      const handler = this.routes.get(method)?.get(url.pathname);
      if (!handler) {
        throw new HttpError(404, `No route for ${method} ${url.pathname}`);
      }

      const body = method === 'GET' ? undefined : await readBody(req);
      const result = await handler({
        method,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams),
        body,
      });

      const wrapped = isHttpResponse(result)
        ? result
        : { status: 200, body: result };
      send(wrapped.status ?? 200, wrapped.body);
    } catch (error) {
      if (error instanceof HttpError) {
        send(error.status, { error: error.message });
      } else {
        send(500, { error: (error as Error).message });
      }
    }
  }
}
