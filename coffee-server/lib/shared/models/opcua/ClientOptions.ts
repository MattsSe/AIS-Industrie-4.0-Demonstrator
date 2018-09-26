import {ConnectionStrategy, MessageSecurityMode, SecurityPolicy} from './index';

export interface ClientOptions {
    securityMode?: MessageSecurityMode;

    securityPolicy?: SecurityPolicy;

    clientName?: string;

    connectionStrategy?: ConnectionStrategy;
}
