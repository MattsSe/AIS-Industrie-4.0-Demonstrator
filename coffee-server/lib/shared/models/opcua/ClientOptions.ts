import { ConnectionStrategy, MessageSecurityMode, SecurityPolicy } from './index';

/**  * @tsoaModel  */ export interface ClientOptions {
    securityMode?: MessageSecurityMode;

    securityPolicy?: SecurityPolicy;

    clientName?: string;

    connectionStrategy?: ConnectionStrategy;
}
