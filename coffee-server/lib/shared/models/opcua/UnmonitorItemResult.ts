
import * as models from './index';

export interface UnmonitorItemResult {
    success?: boolean;

    wasMonitored?: boolean;

    nodeId?: string;

    attributeId?: number;

}
