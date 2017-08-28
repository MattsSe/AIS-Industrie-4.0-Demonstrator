/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-api';
import * as async from 'async';
import * as connector from './ConnectorService';
import * as opcua from 'node-opcua';
import {util} from '../opcua/ua.util';

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
  const result: api.MonitoredItemData;
  const nodeId = params.nodeId;
  const attribute = params.attributeId || {};
  const body = params.body; // MonitorItemOptions

  let valid = false;
  if (nodeId) {
    valid = true;
    connector.doConnect({
      endpointUrl: 'opc.tcp://localhost:4334/UA/MyLittleServer'
    }, (err) => {
      if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
        const resolvedId = opcua.resolveNodeId(nodeId.value);
        try {
          const attributeId = attribute.value || opcua.AttributeIds.Value;
          const options = body.value || {} as api.MonitorItemOptions;
          const item = UAClientService.INSTANCE.monitorItem(resolvedId, attributeId, options);
          item.on('initialized', v => {
            result = {
              browseName: item.itemToMonitor.nodeId.value,
              nodeId: item.itemToMonitor.nodeId.toString(),
              attributeId: item.itemToMonitor.attributeId,
              subscriptionId: item.subscription.subscriptionId,
              value: '',
              datatype: ''
            };
            if (v) {
              result.value = util.toString1(item.itemToMonitor.attributeId, v);
              result.datatype = v.dataType.toString();
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
    });
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
  item.on('changed', v => {
    const data: api.ItemChangeData = {
      itemName: item.itemToMonitor.nodeId.value,
      value: util.toString1(item.itemToMonitor.nodeId.value, v),
      statusCode: v.statusCode.toString(),
      attributeId: item.itemToMonitor.attributeId
    };
    console.log(data);
    UAClientService.INSTANCE.socket.emitSubscriptionChange('monitored', data);
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
  const examples = {};
  examples['application/json'] = [{}];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }

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
