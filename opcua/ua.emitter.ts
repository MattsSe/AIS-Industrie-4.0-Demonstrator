import {UASocket} from './ua.socket';
import {UAClientService} from './ua.service';
import {EmitterRoutes} from 'ais-shared';

/**
 * Created by Matthias on 18.08.17.
 */

export class UASocketEmitter {

  constructor(private uasocket: UASocket, private uaClientService: UAClientService) {
    this.initEmitterEvents();
  }

  /**
   * alias
   * @returns {SocketIO.Server}
   */
  protected get io() {
    return this.uasocket.getSocket();
  }

  /**
   * implements all emitter routes
   */
  public initEmitterEvents() {
    const self = this;
    self.io.on('connection', function (socket) {
      console.log('Socket connected');

      socket.on(EmitterRoutes.referenceChildren, args => self.onReferenceChildren(args));

      // Socket event for gist created
      socket.on('gistSaved', function (gistSaved) {
        self.io.emit('gistSaved', gistSaved);
        console.log('gistsave called on server');
      });
      // Socket event for gist updated
      socket.on('gistUpdated', function (gistUpdated) {
        self.io.emit('gistUpdated', gistUpdated);
      });
    });
    // this.io.on(EmitterRoutes.referenceChildren, (nodeId) => {
    //
    // });
  }

  public onReferenceChildren(nodeId) {
    console.log('on Reference Children called with nodeID: ' + nodeId);
  }

  /**
   * Delegate Method
   * @param event
   * @param args
   * @returns {Namespace}
   */
  public emit(event: string, ...args: any[]) {
    return this.io.emit(event, args);
  }

}
