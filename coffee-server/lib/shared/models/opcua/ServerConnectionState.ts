/**
 * Created by Matthias on 23.08.17.
 */

import * as models from './models';

export interface ServerConnectionState {
  connected: boolean,
  endPointUrl: string;
}
