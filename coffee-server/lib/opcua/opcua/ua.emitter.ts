import {UASocket} from './ua.socket';
import {UAClientService} from '../service/UAClientService';
import * as api from '../../shared/models/index';

/**
 * Created by Matthias on 18.08.17.
 */

export class UASocketEmitter {

  /**
   *
   * @param uasocket
   * @param uaClientService
   */
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
      console.log('Socket connected on opcua');

      // socket.on(EmitterRoutes.referenceChildren, args => self.onReferenceChildren(args));

      // Socket event for gist created
      socket.on('uaLogging', function (gistSaved) {
        // self.io.emit('gistSaved', gistSaved);
        console.log('uaLogging called on opcua');
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
