import * as models from './index';
import {OPCUAClientOptions, MessageSecurityMode, SecurityPolicy} from './index';

export interface ClientOptions {
    securityMode?: MessageSecurityMode;

    securityPolicy?: SecurityPolicy;

    clientName?: string;

    connectionStrategy?: OPCUAClientOptions;

}
