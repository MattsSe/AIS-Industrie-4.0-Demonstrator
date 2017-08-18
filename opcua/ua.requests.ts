/**
 * Created by Matthias on 18.08.17.
 */
import {UAClientService, UAClientProvider} from './ua.service';

/**
 * class to handle the Requests to the OPC UA Client
 */
export class UARequestHandler implements UAClientProvider {

  public opcuaService(): UAClientService {
    return UAClientService.INSTANCE;
  }

}
