import {UASocket} from './ua.socket';
import {UAClientService} from './ua.service';
import {opcua, EmitterRoutes} from 'ais-shared';

/**
 * Created by Matthias on 18.08.17.
 */

export class UASocketEmitter {

  constructor(private uasocket: UASocket, private uaClientService: UAClientService) {
    this.initEmitters();
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
  protected initEmitters() {
    this.io.on(EmitterRoutes.referenceChildren, (nodeId) => {

    });
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
