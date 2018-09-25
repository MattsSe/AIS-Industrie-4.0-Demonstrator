
import * as models from './index';

export interface ServerConnection {
    endpointUrl: string;

    forceReconnect?: boolean;

    keepSessionAlive?: boolean;

    clientOptions?: models.ClientOptions;

}
