/**
 * Created by Matthias on 14.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as data from 'ais-shared';
import * as async from 'async';

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
 * Checks if the client is connected to the url, url is a query param
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
  let connected = UAClientService.INSTANCE.isConnected();
  const serverEndpoint = UAClientService.INSTANCE.endPointUrl;
  if (urlQuery.value) {
    console.log(serverEndpoint);
    console.log(urlQuery.value);
    connected = connected && (serverEndpoint === urlQuery.value);
  }
  res.setHeader('Content-Type', 'application/json');
  const serverState: data.opcua.ServerState = {
    connected: connected,
    endPointUrl: serverEndpoint || ''
  };
  res.end(JSON.stringify(serverState));
}

/**
 * connects a new opc client to an opc server -> needs valid endpointurl
 * @param options
 */
function doConnect(options: data.ServerConnection, cllback) {
  const clientOptions = options.clientOptions || {};
  const client = UAClientService.INSTANCE.createClient(clientOptions);
  async.series([
      callback => {
        UAClientService.INSTANCE.connectClient(options.endpointUrl, callback);
      },
      callback => {
        UAClientService.INSTANCE.createSession(callback);
      }
    ],
    cllback());
}

export function connectServer(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * url (String)
   **/

  res.setHeader('Content-Type', 'application/json');

  if (params.body) {
    console.log(data.util.isValidServerConnection(params.body.value));
    if (data.util.isValidServerConnection(params.body.value)) {
      const options = params.body.value as data.ServerConnection;
      if (UAClientService.INSTANCE.isConnected()) {
        if (typeof options.forceReconnect === 'boolean') {
          if (options.forceReconnect) {
            UAClientService.INSTANCE.disconnectClient();
            doConnect(options, err => {
              console.log('reconnect done');
              res.end('reconn worked');
            });
          }
        }

      } else {
        doConnect(options, err => {
          console.log('connect done');
          res.end('conn worked');
        });
      }
    } else {
      res.end('not valid');
    }
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

