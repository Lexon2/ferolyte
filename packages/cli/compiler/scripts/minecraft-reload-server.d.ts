import { WebSocket } from 'ws';
type RequestPurpose = 'commandRequest';
interface RequestBody {
    commandLine: string;
}
interface CommandResponse {
    status: number;
    message: string;
}
declare class MinecraftClient {
    private client;
    constructor(client: WebSocket);
    send(purpose: RequestPurpose, body: RequestBody, uuid?: string): void;
    sendCommand(command: string): Promise<CommandResponse>;
    sendMessage(message: string): void;
}
export declare class MinecraftServer {
    private server;
    constructor(port: number);
    get clients(): Set<MinecraftClient>;
    dispose(): void;
}
export {};
//# sourceMappingURL=minecraft-reload-server.d.ts.map