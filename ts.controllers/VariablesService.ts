/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-shared';
import * as async from 'async';


export function readVariableValue(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
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


export function writeVariableValue(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   * value (String)
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
