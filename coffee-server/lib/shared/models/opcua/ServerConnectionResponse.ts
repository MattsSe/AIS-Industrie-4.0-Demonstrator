/**
 * Created by Matthias on 23.08.17.
 */

import * as models from './models';

export interface ServerConnectionResponse {
  success: boolean;
  msg?: string;
  state?: models.ServerConnectionState;
}
