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

  // TODO remove
  connector.doConnect({
    endpointUrl: 'opc.tcp://:4334/UA/MyLittleServer'
  }, (err) => {
    console.log('is connected' + UAClientService.INSTANCE.isConnected());

    UAClientService.INSTANCE.browseChildren(nodeId.value, (err1, browse_result) => {
      //       console.log(err);
      if (!err1) {
        browse_result[0].references.forEach(reference => {
          data.push({
            nodeId: reference.referenceTypeId.toString(),
            browseName: reference.browseName.toString(),
            nodeClass: util.nodeClassMaskIdToString(reference.nodeClass.value)
          });
        });
      }

      res.end(JSON.stringify(data));
    });
  });
  return;

  // if (nodeId) {
  //   if (nodeId.value) {
  //     // if (UAClientService.INSTANCE.isConnected()) {
  //     UAClientService.INSTANCE.browseChildren(nodeId.value, (err, response) => {
  //       console.log(err);
  //       console.log(response);
  //     });
  //     // }
  //   }
  // }

}

