/**
 * Created by Matthias on 14.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import {opcua as uadata} from 'ais-shared';
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

/**
 * Checks if the client is connected to the url
 * @param params
 * @param res
 * @param next
 */
export function getServerConnectionState(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * url (String)
   **/

  const urlQuery = params.url;

  const connected = UAClientService.INSTANCE.isConnected();
  const serverEndpoint = UAClientService.INSTANCE.endPointUrl;
  if (urlQuery.value) {
    connected = connected && (serverEndpoint === urlQuery.value);
  }
  res.setHeader('Content-Type', 'application/json');
  const serverState: uadata.ServerState = {
    connected: connected,
    endPointUrl: serverEndpointl || ''
  };
  res.end(JSON.stringify(serverState));
}

export function connectServer(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * url (String)
   **/

  res.setHeader('Content-Type', 'application/json');
  console.log(params.reconnect);
  res.end(JSON.stringify({dummy: 'value'}));
  // const requestedURL = params.url;
  // console.log(requestedURL);
  // if (true) {
  //   res.end(requestedURL);
  // }
  // /*check valid url*/
  // // TODO
  //
  // const connResponse: uadata.RequestServerConnectionResponse = {
  //   success: false
  // }
  // /*already connected*/
  // if (!UAClientService.INSTANCE.isConnected()) {
  //   UAClientService.INSTANCE.connectClient(requestedURL, err => {
  //     if (!err) {
  //       connResponse.success = true;
  //     }
  //     res.end(JSON.stringify(connResponse));
  //   })
  // } else {
  //   res.end(JSON.stringify(connResponse));
  // }
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

