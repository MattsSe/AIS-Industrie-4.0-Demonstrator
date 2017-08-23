/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-api';
import * as async from 'async';


export function monitorItem(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * nodeId (String)
   * attributeId (Integer)
   **/
  const examples = {};
  examples['application/json'] = {};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }

}

/**
 * Utility Class to keep swagger gen code and write appropriated services externally in typescript
 */

export function clearMonitoredItem(eq: Request, res: Response, next: NextFunction) {

}

export function clearMonitoredItems(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * limit (Integer)
   **/
  // no response value expected for this operation
  res.end();
}

export function getMonitoredItem(params, res: Response, next: NextFunction) {
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

export function getMonitoredItems(params, res: Response, next: NextFunction) {
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
