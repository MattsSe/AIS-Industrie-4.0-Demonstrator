
import {ClientOptions} from './index';

/**  * @tsoaModel  */ export interface ServerConnection {
    endpointUrl: string;

    forceReconnect?: boolean;

    keepSessionAlive?: boolean;

    clientOptions?: ClientOptions;

}
