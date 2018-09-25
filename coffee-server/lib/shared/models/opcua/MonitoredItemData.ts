
import * as models from './index';

/**
 * The Information of the current monitored item on an OPC UA Server
 */
export interface MonitoredItemData {
  nodeId?: string;

  attributeId?: number;

  /**
   * The subscription ID in which this monitored item is monitored
   */
  subscriptionId?: number;

  /**
   * The ID of the actual monitored object
   */
  value?: string;

  datatype?: string;
  browseName?: string;
  statusCode?: string;

}
