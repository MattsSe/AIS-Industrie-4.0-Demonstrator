/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-api';
import * as connector from './ConnectorService';
import * as opcua from 'node-opcua';
import {util} from '../opcua/ua.util';


/**
 * removes a specific subscription if any present
 * @param params
 * @param res
 * @param next
 */
export function unmonitorItem(params, res: Response, next: NextFunction) {
  res.setHeader('Content-Type', 'application/json');
  const nodeId = params.nodeId || {};
  const attribute = params.attributeId || {};
  const result: api.UnmonitorItemResult = {
    success: false,
    wasMonitored: false,
    nodeId: nodeId.value,
    attributeId: attribute.value,
  };
  if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
    const counter = UAClientService.INSTANCE.unmonitorItem(result.nodeId, result.attributeId);
    result.success = counter > 0;
    result.wasMonitored = counter > 0
  }
  res.end(JSON.stringify(result));
}

/**
 * @POST monitor changes for the desired item
 * @param params
 * @param res
 * @param next
 */
export function monitorItem(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   * attributeId (Integer)
   **/
  res.setHeader('Content-Type', 'application/json');
  let result: api.MonitoredItemData;
  const nodeId = params.nodeId;
  const attribute = params.attributeId || {};
  const body = params.body; // MonitorItemOptions

  let valid = false;
  if (nodeId) {
    if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
      valid = true;
      const resolvedId = opcua.resolveNodeId(nodeId.value);
      try {
        const attributeId = attribute.value || opcua.AttributeIds.Value;
        const options = body.value || {} as api.MonitorItemOptions;
        const item = UAClientService.INSTANCE.monitorItem(resolvedId, attributeId, options);
        item.on('initialized', val => {
          result = {
            browseName: item.itemToMonitor.nodeId.value,
            nodeId: item.itemToMonitor.nodeId.toString(),
            attributeId: item.itemToMonitor.attributeId,
            subscriptionId: item.subscription.subscriptionId,
            value: '',
            datatype: ''
          };
          if (val) {
            const v = val as opcua.DataValue;
            result.value = util.toString1(item.itemToMonitor.attributeId, v);
            result.datatype = v.value.dataType.toString();
          }
          res.end(JSON.stringify(result));
        })

        // publish change through socket
        if (options.publishChangeOnSocket) {
          publishChangeOnSocket(item);
        }
      } catch (err) {
        res.end(JSON.stringify(null));
      }
      return
    }
  }


  if (!valid) {
    res.end(JSON.stringify(null));
  }
}


/**
 * Sends the Data through the socket
 * @param item
 * @param result
 */
function publishChangeOnSocket(item: opcua.ClientMonitoredItem) {
  item.on('changed', val => {
    const v = val as opcua.DataValue;
    const data: api.MonitoredItemData = {
      browseName: item.itemToMonitor.nodeId.value,
      nodeId: item.itemToMonitor.nodeId.toString(),
      attributeId: item.itemToMonitor.attributeId,
      subscriptionId: item.subscription.subscriptionId,
      value: util.toString1(item.itemToMonitor.nodeId.value, v),
      statusCode: v.statusCode.toString(),
      datatype: v.value.dataType.toString()
    };
    UAClientService.INSTANCE.socket.emitSubscriptionChange(data);
  });
}

/**
 * Utility Class to keep swagger gen code and write appropriated services externally in typescript
 */

export function clearMonitoredItemsForNodeId(eq: Request, res: Response, next: NextFunction) {

}

export function clearMonitoredItems(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * limit (Integer)
   **/
    // no response value expected for this operation
  const limit = params.limit || {};
  UAClientService.INSTANCE.unmonitorAll(limit.value);
  res.end();
}

export function getMonitoredItemsForNodeId(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   **/
  const examples = {};
  examples['application/json'] = [{}];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }

}

export function getAllMonitoredItems(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * limit (Integer)
   **/
  res.setHeader('Content-Type', 'application/json');
  const items: api.MonitoredItemDataList = [];
  UAClientService.INSTANCE.getAllMonitoredItemData().forEach((value, index, array) => {
    const item: api.MonitoredItemData = {
      browseName: value.monitoredItem.itemToMonitor.nodeId.value,
      nodeId: value.monitoredItem.itemToMonitor.nodeId.toString(),
      attributeId: value.monitoredItem.itemToMonitor.attributeId,
      subscriptionId: value.monitoredItem.subscription.subscriptionId,
      value: '',
      datatype: '',
    }
    items.push(item);
    // TODO
  });
  res.end(JSON.stringify(items));
}

export function getMonitoredItem(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * limit (Integer)
   **/
  const examples = {};
  examples['application/json'] = [{}];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}
