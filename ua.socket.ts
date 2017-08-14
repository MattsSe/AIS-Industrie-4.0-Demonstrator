import * as io from 'socket.io';
import {Server} from 'http';
/**
 * Created by Matthias on 13.08.17.
 */


export class UASocket {

  private io: SocketIO.Server;

  public static create(server: Server) {
    return new UASocket(server);
  }

  public getSocket() {
    return this.io;
  }

  constructor(server: Server) {
    this.io = io().listen(server);
    this.init();
  }

  private init() {
    const _io = this.io;
    _io.on('connection', function (socket) {
      console.log('Socket connected');
      // Socket event for gist created
      socket.on('gistSaved', function (gistSaved) {
        _io.emit('gistSaved', gistSaved);
        console.log('gistsave called on server');
      });
      // Socket event for gist updated
      socket.on('gistUpdated', function (gistUpdated) {
        _io.emit('gistUpdated', gistUpdated);
      });
    });
  }

}
