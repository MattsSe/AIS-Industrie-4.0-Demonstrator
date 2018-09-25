
import * as models from './index';

export interface ConnectionStrategy {
    maxRetry?: number;

    initialDelay?: number;

    maxDelay?: number;

    randomisationFactor?: number;

}
