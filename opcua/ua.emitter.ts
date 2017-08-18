import {UASocket} from './ua.socket';
import {UAClientService} from './ua.service';
import {data} from 'ais-shared';

/**
 * Created by Matthias on 18.08.17.
 */

export class UASocketEmitter {

  constructor(private uasocket: UASocket, private uaClientService: UAClientService) {
    this.initEmitters();
  }

  /**
   * implements all emitter routes
   */
  protected initEmitters() {

  }

  /**
   * Delegate Method
   * @param event
   * @param args
   * @returns {Namespace}
   */
  public emit(event: string, ...args: any[]) {
    return this.uasocket.getSocket().emit(event, args);
  }

}
