import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

import type {
  MinecraftHttpHandler,
  MinecraftHttpResponse,
} from '../plugins/types';
import { isMarkedHttpResponse } from '../plugins/http-response';
import { logger } from '../utils/logger';
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

/**
 * A handler result is a response envelope when it was made with `httpResponse()` (marker). Without the
 * marker the legacy shape still counts: nothing but `status` (a number) and/or `body`, so a payload such as
 * `{ status: 'ok' }` is sent as a plain 200 body.
 */
const isHttpResponse = (value: unknown): value is MinecraftHttpResponse => {
  if (isMarkedHttpResponse(value)) {
    return true;
  }
  if (!value || typeof value !== 'object') {
    return false;
  }
  const keys = Object.keys(value);
  const { status } = value as { status?: unknown };

  return (
    keys.length > 0 &&
    keys.every((key) => key === 'status' || key === 'body') &&
    (status === undefined || (typeof status === 'number' && Number.isInteger(status)))
  );
};

const toHeaders = (req: IncomingMessage): Record<string, string> => {
  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) {
      headers[name.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value;
    }
  }

  return headers;
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
  /** Prefix routes (`/api/*`), per method, longest prefix first. */
  private readonly prefixRoutes = new Map<
    string,
    Array<{ prefix: string; handler: MinecraftHttpHandler }>
  >();
  private readonly overridden = new Set<string>();
  private server: Server | undefined;

  constructor(private readonly hub: MinecraftHub) {
    this.route('GET', '/status', () => ({
      connected: this.hub.clients.length > 0,
      clients: this.hub.clients,
      inFlight: this.hub.inFlight,
      lastEventSeq: this.hub.lastEventSeq,
      lastReload: this.hub.lastReload,
    }));
    this.route('POST', '/command', ({ body }) => {
      const data = asRecord(body);
      return this.hub
        .sendCommand(requireString(data.command, 'command'), {
          timeoutMs: typeof data.timeoutMs === 'number' ? data.timeoutMs : undefined,
        })
        .then(({ status, message }) => ({ status, message }));
    });
    this.route('POST', '/scriptevent', ({ body }) => {
      const data = asRecord(body);
      return this.hub
        .scriptEvent(
          requireString(data.id, 'id'),
          typeof data.message === 'string' ? data.message : '',
        )
        .then(({ status, message }) => ({ status, message }));
    });
    this.route('GET', '/events', ({ query }) => {
      const since = Number(query.since ?? 0);
      const limit = Number(query.limit);
      const events = this.hub.eventsSince(Number.isFinite(since) ? since : 0);

      return {
        events:
          Number.isInteger(limit) && limit > 0 ? events.slice(-limit) : events,
        last: this.hub.lastEventSeq,
      };
    });
    this.route('POST', '/subscribe', ({ body }) => {
      const data = asRecord(body);
      const name = data.eventName ?? data.event;
      this.hub.subscribe(requireString(name, 'eventName'));
      return { ok: true };
    });
  }

  /**
   * Registers a route. A route registered twice **replaces** the previous one (also a built-in one;
   * the override is logged once per path). `path` may end in `/*` to match every path below it; an exact
   * route wins over a prefix route.
   */
  route(method: string, path: string, handler: MinecraftHttpHandler) {
    const key = method.toUpperCase();

    if (path.endsWith('/*')) {
      const prefix = path.slice(0, -1);
      const list = (this.prefixRoutes.get(key) ?? []).filter(
        (entry) => entry.prefix !== prefix,
      );
      list.push({ prefix, handler });
      list.sort((a, b) => b.prefix.length - a.prefix.length);
      this.prefixRoutes.set(key, list);

      return;
    }

    let byPath = this.routes.get(key);
    if (!byPath) {
      byPath = new Map();
      this.routes.set(key, byPath);
    }
    const label = `${key} ${path}`;
    if (byPath.has(path) && !this.overridden.has(label)) {
      this.overridden.add(label);
      logger.verbose(`[ferolyte:http] route ${label} overridden by plugin`);
    }
    byPath.set(path, handler);
  }

  private findHandler(method: string, path: string): MinecraftHttpHandler | undefined {
    const exact = this.routes.get(method)?.get(path);
    if (exact) {
      return exact;
    }

    return this.prefixRoutes.get(method)?.find((entry) => path.startsWith(entry.prefix))
      ?.handler;
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

    // Aborted when the client goes away before the response was written.
    const aborted = new AbortController();
    res.once('close', () => {
      if (!res.writableFinished) {
        aborted.abort();
      }
    });

    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      const method = (req.method ?? 'GET').toUpperCase();
      const handler = this.findHandler(method, url.pathname);
      if (!handler) {
        throw new HttpError(404, `No route for ${method} ${url.pathname}`);
      }

      const body = method === 'GET' ? undefined : await readBody(req);
      const result = await handler({
        method,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams),
        body,
        headers: toHeaders(req),
        signal: aborted.signal,
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
