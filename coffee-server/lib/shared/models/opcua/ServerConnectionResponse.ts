
import * as models from './index';

export interface ServerConnectionResponse {
  success: boolean;
  msg?: string;
  state?: models.ServerConnectionState;
}
