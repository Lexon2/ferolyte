import { v4 } from 'uuid';
import { WebSocketServer, WebSocket } from 'ws';

interface Data<T, U> {
  body: T;
  header: U;
}

type RequestPurpose = 'commandRequest';

interface RequestBody {
  commandLine: string;
}

type ResponsePurpose = 'commandResponse';

interface ResponseBody {
  statusCode: number;
  statusMessage: string;
}

interface ResponseHeader {
  requestId: string;
  messagePurpose: ResponsePurpose;
  version: number;
}

type ResponseData = Data<ResponseBody, ResponseHeader>;

interface CommandResponse {
  status: number;
  message: string;
}

class MinecraftClient {
  private client: WebSocket;

  constructor(client: WebSocket) {
    this.client = client;
  }

  send(purpose: RequestPurpose, body: RequestBody, uuid: string = v4()) {
    this.client.send(
      JSON.stringify({
        body,
        header: {
          requestId: uuid,
          messagePurpose: purpose,
          version: 1,
        },
      }),
    );
  }

  sendCommand(command: string): Promise<CommandResponse> {
    const uuid = v4();
    this.send('commandRequest', { commandLine: command }, uuid);

    return new Promise((resolve) => {
      this.client.on('message', (data: Buffer | ArrayBuffer | Buffer[]) => {
        const res: ResponseData = JSON.parse(data.toString());

        if (res.header.requestId !== uuid) {
          return;
        }

        resolve({
          message: res.body.statusMessage,
          status: res.body.statusCode,
        });
      });
    });
  }

  sendMessage(message: string) {
    this.sendCommand(
      'tellraw @a ' + JSON.stringify({ rawtext: [{ text: message }] }),
    );
  }
}

export class MinecraftServer {
  private server: WebSocketServer;

  constructor(port: number) {
    this.server = new WebSocketServer({ port: port });

    if (this.server.address() === null) {
      throw Error(`Port ${port} is already in use.`);
    }
  }

  get clients() {
    return new Set(
      Array.from(this.server.clients).map(
        (client) => new MinecraftClient(client),
      ),
    );
  }

  dispose() {
    this.server.close();
  }
}
