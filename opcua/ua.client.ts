/**
 * Created by Matthias on 14.08.17.
 */
import * as opc from 'node-opcua';
import {OPCUAClient, OPCUAClientOptions} from 'node-opcua';


interface UAClientOptions extends OPCUAClientOptions {
}

export class UAClient extends OPCUAClient {

  constructor(options: UAClientOptions) {
    super(options);
  }

}
