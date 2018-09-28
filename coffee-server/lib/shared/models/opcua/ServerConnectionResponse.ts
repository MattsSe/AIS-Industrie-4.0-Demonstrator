
import * as models from './index';

/**  * @tsoaModel  */ export interface ServerConnectionResponse {
  success: boolean;
  msg?: string;
  state?: models.ServerConnectionState;
}
