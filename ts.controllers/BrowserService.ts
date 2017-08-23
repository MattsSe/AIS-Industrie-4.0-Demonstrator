/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-shared';
import * as async from 'async';


export function getBrowseInfo(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * qualifiedName (String)
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
 * @GET returns all Available Attributes for the given nodeID
 * @param params Attributes options
 * @param res
 * @param next
 */
export function getAllAttributes(params, res: Response, next: NextFunction) {

}


/**
 * returns the directly nested child items under the item with the given nodeId
 * @GET
 * @param params with the nodeId for the desired item
 * @param res
 * @param next
 */
export function getChildren(params, res: Response, next: NextFunction) {

}
