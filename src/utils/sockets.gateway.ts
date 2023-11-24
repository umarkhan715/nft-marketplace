import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import console from 'console';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3002',
  },
  allowEIO3: true,
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;
  public static socket: any;

  async handleConnection(@ConnectedSocket() client: any) {
    console.log('connection may hu');
    SocketsGateway.socket = client;

    console.log(`new client added ${client.id}`);
    // client.emit('added', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    console.log(`client leave the room ${client.id}`);
  }
}
