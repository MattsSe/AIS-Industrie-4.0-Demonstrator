/**
 * Created by Matthias on 18.08.17.
 */
import * as opcua from 'node-opcua';

export namespace util {

  export function toString(): string {
    // TODO implement
    return '';
  }

  export function isNodeId(id: opcua.NodeId | string): id is opcua.NodeId {
    return (<opcua.NodeId>id).identifierType !== undefined;
  }

}
export namespace defaults {

  /**
   * default values for a subscription idle is 1 second
   * @type {{requestedPublishingInterval: number; requestedLifetimeCount: number;
   * requestedMaxKeepAliveCount: number; maxNotificationsPerPublish: number;
   * publishingEnabled: boolean; priority: number}}
   */
  export const subscriptionOptions: opcua.ClientSubscriptionOptions = {
    requestedPublishingInterval: 100,
    requestedLifetimeCount: 1000,
    requestedMaxKeepAliveCount: 12,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10
  };

  /**
   * default values for the request options for a monitored item of a clientsubscription
   * @type {{samplingInterval: number; discardOldest: boolean; queueSize: number}}
   */
  export const itemToMonitorRequestedParameters: opcua.ItemToMonitorRequestedParameters = {
    samplingInterval: 1000,
    discardOldest: true,
    queueSize: 100
  }
}
