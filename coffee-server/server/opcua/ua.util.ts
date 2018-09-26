/**
 * Created by Matthias on 18.08.17.
 */
import * as opcua from 'node-opcua';
import * as _ from 'underscore';

export namespace util {
  export const attributeIdtoString = _.invert(opcua.AttributeIds);
  export const DataTypeIdsToString = _.invert(opcua.DataTypeIds);
  const nodeMaskKeys = Object.keys(opcua.browse_service.NodeClassMask);
  export const NodeClassMaskIdToName = {
    names: nodeMaskKeys.slice((nodeMaskKeys.length / 2) - 1),
    ids: nodeMaskKeys.slice(0, (nodeMaskKeys.length / 2) - 1)
  };

  export function toString(): string {
    // TODO implement
    return '';
  }

  // TODO
  export function toString1(attribute: number, dataValue: opcua.DataValue): string {
    if (!dataValue || !dataValue.value || !dataValue.value.hasOwnProperty('value')) {
      return '<null>';
    }
    switch (attribute) {
      case opcua.AttributeIds.DataType:
        return DataTypeIdsToString[dataValue.value.value.value] + ' (' + dataValue.value.value.toString() + ')';
      case opcua.AttributeIds.NodeClass:
        return nodeClassMaskIdToString(dataValue.value.value) + ' (' + dataValue.value.value + ')';
      case opcua.AttributeIds.WriteMask:
      case opcua.AttributeIds.UserWriteMask:
        return ' (' + dataValue.value.value + ')';
      case opcua.AttributeIds.NodeId:
      case opcua.AttributeIds.BrowseName:
      case opcua.AttributeIds.DisplayName:
      case opcua.AttributeIds.Description:
      case opcua.AttributeIds.EventNotifier:
      case opcua.AttributeIds.ValueRank:
      case opcua.AttributeIds.ArrayDimensions:
      case opcua.AttributeIds.Historizing:
      case opcua.AttributeIds.Executable:
      case opcua.AttributeIds.UserExecutable:
      case opcua.AttributeIds.MinimumSamplingInterval:
        if (!dataValue.value.value) {
          return 'null';
        }
        return dataValue.value.value.toString();
      case opcua.AttributeIds.UserAccessLevel:
      case opcua.AttributeIds.AccessLevel:
        if (!dataValue.value.value) {
          return 'null';
        }
        return opcua.AccessLevelFlag[dataValue.value.value] + ' (' + dataValue.value.value + ')';
      default:
        return dataValueToString(dataValue);
    }
  }

  export function dataValueToString(dataValue) {
    if (!dataValue.value || dataValue.value.value === null) {
      return '<???> : ' + dataValue.statusCode.toString();
    }
    switch (dataValue.value.arrayType) {
      case opcua.VariantArrayType.Scalar:
        return dataValue.value.value;
      case opcua.VariantArrayType.Array:
        return dataValue.toString();
      default:
        return '';
    }
  }

  /**
   *
   * @param datavalue an node-opcua Datavalue
   * @returns the Type of the Datavalue as string
   */
  export function getDatatValueType(datavalue: opcua.DataValue) {
    return datavalue.value.dataType['key'];

  }

  export function isNodeId(id: opcua.NodeId | string): id is opcua.NodeId {
    return (<opcua.NodeId>id).identifierType !== undefined;
  }

  export function nodeClassMaskIdToString(value: number) {
    return NodeClassMaskIdToName.names[value];
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
