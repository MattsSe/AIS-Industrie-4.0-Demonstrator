
import * as models from './index';

/**  * @tsoaModel  */ export interface ServerConnection {
    endpointUrl: string;

    forceReconnect?: boolean;

    keepSessionAlive?: boolean;

    clientOptions?: models.ClientOptions;

}
