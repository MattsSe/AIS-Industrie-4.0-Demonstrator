/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-api';
import * as connector from './ConnectorService';
import * as opc from 'node-opcua';
import {util} from '../opcua/ua.util';


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
 * @see api.ReferenceDataList
 * @GET
 * @param params with the nodeId for the desired item
 * @param res
 * @param next
 */
export function getChildren(params, res: Response, next: NextFunction) {

  const data: api.ReferenceDataList = [];
  res.setHeader('Content-Type', 'application/json');
  const nodeId = params.nodeId;

  let valid = false;

  if (nodeId) {
    if (nodeId.value) {
      if (UAClientService.INSTANCE.isConnected()) {
        valid = true;
        UAClientService.INSTANCE.browseChildren(nodeId.value, (err, browse_result) => {
          if (!err) {
            [0, 1].forEach(index => {
              browse_result[index].references.forEach(reference => {
                data.push({
                  nodeId: reference.nodeId.toString(),
                  browseName: reference.browseName.toString(),
                  nodeClass: util.nodeClassMaskIdToString(reference.nodeClass.value),
                  typeIdEnum: index === 0 ?
                    api.ReferenceData.TypeIdEnumEnum.Organizes : api.ReferenceData.TypeIdEnumEnum.Aggregates
                });
              });
            });
          }

          res.end(JSON.stringify(data));
        });
      }
    }
  }

  if (!valid) {
    res.end(JSON.stringify(data));
  }
}

