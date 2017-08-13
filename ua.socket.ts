import * as io from 'socket.io';
import {Server} from 'http';
/**
 * Created by Matthias on 13.08.17.
 */


export class UASocket {

  private socket: SocketIO.Server;

  constructor(server: Server) {
    this.socket = io(server);
  }

  public getSocket() {
    return this.socket;
  }

}
