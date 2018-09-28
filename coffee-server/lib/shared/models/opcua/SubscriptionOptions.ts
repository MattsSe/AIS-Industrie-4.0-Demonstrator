
import * as models from './index';

/**
 * options for creating a new OPCUACLient subscription
 */
/**  * @tsoaModel  */ export interface SubscriptionOptions {
    requestedPublishingInterval?: number;

    requestedLifetimeCount?: number;

    requestedMaxKeepAliveCount?: number;

    maxNotificationsPerPublish?: number;

    publishingEnabled?: boolean;

    priority?: number;

}
