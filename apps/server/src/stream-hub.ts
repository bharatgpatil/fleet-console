import type { DeltaMessage, ServerMessage } from '@fleet/contracts';
import type { FleetEngine } from '@fleet/domain';
import { CLOSE_TOO_SLOW, MAX_BUFFERED_BYTES, SOCKET_OPEN } from './constants.ts';
import type { StreamClient, StreamSocket } from './types.ts';

export class StreamHub {
  private readonly clients = new Set<StreamClient>();
  private readonly engine: FleetEngine;
  private readonly now: () => number;

  constructor(engine: FleetEngine, now: () => number) {
    this.engine = engine;
    this.now = now;
  }

  connect(socket: StreamSocket): () => void {
    const client: StreamClient = { socket, sequence: 0 };
    const serverTime = this.now();

    this.clients.add(client);
    this.send(client, {
      type: 'snapshot',
      sequence: client.sequence,
      serverTime,
      snapshot: this.engine.snapshot(serverTime),
    });

    return () => {
      this.clients.delete(client);
    };
  }

  flush(): void {
    const delta = this.engine.drainDelta();
    const body: Omit<DeltaMessage, 'type' | 'sequence'> = { serverTime: this.now(), ...delta };
    const json = JSON.stringify(body);

    for (const client of this.clients) {
      client.sequence++;

      this.sendRaw(client, `{"type":"delta","sequence":${client.sequence},${json.slice(1)}`);
    }
  }

  private send(client: StreamClient, message: ServerMessage): void {
    this.sendRaw(client, JSON.stringify(message));
  }

  private sendRaw(client: StreamClient, payload: string): void {
    const { socket } = client;

    if (socket.readyState !== SOCKET_OPEN) {
      this.clients.delete(client);

      return;
    }

    if (socket.bufferedAmount > MAX_BUFFERED_BYTES) {
      socket.close(CLOSE_TOO_SLOW, 'client too slow');
      this.clients.delete(client);

      return;
    }

    socket.send(payload);
  }
}
