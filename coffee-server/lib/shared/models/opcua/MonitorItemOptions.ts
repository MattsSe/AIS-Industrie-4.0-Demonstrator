
import * as models from './index';

/**
 * additional options for monitoring an Item for a subscription
 */
export interface MonitorItemOptions {
    samplingInterval?: number;

    discardOldest?: boolean;

    queueSize?: number;

    /**
     * If requested, any change of the monitored item will also be publish through a websocket
     */
    publishChangeOnSocket?: boolean;

}
