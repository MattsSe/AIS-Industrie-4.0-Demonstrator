/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-api';
import * as async from 'async';
import {util} from '../opcua/ua.util';

export function readVariableValue(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   * assuming attributeId = 13 -> value
   **/
  const result: api.VariableValue = {
    valid: false
  }
  const nodeId = params.nodeId || {};
  const attribute = params.attributeId || {};
  let valid = false;
  if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
    result.nodeId = nodeId.value;
    valid = true;
    UAClientService.INSTANCE.session.readVariableValue(nodeId.value, (err, dataValue) => {
      if (!err) {
        result.valid = true;
        result.value = util.toString1(13, dataValue);
      }
    });
  }
  if (!valid) {
    res.end(JSON.stringify(result));
  }
}


export function writeVariableValue(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   * attributeId (String)
   **/
  const examples = {};
  examples['application/json'] = {
    'valid': true,
    'nodeId': 'aeiou',
    'value': 'aeiou'
  };
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }

}

export function readVariableValueForAttributeId(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   * attributeId (String)
   **/
  const result: api.VariableValue = {
    valid: false
  }
  const nodeId = params.nodeId || {};
  const attribute = params.attributeId || {};
  let valid = false;
  if (nodeId.value && UAClientService.INSTANCE.isConnected()) {
    result.nodeId = nodeId.value;
    valid = true;

    const nodesToRead = [
      {
        nodeId: nodeId.value,
        attributeId: attribute.value || 13
      }
    ];

    UAClientService.INSTANCE.session.read(nodesToRead, (err, nodesRead, results, diagnosticInfos) => {
      if (!err) {
        result.valid = true;
        result.value = util.toString1(13, results[0]);
      }
    });
  }
  if (!valid) {
    res.end(JSON.stringify(result));
  }

}
