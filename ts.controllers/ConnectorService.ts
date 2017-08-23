/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Request, Response} from 'express';
import {UAClientService} from '../opcua/ua.service';
import * as api from 'ais-api';
import * as async from 'async';


/**
 *
 * @param options
 * @param res
 */
function doReconnect(options: api.ServerConnection, res: Response) {
  if (typeof options.forceReconnect === 'boolean' && options.forceReconnect) {
    UAClientService.INSTANCE.disconnectClient();
    try {
      doConnect(options, err => {
        const r: api.ServerConnectionResponse = {
          success: err ? false : true,
          msg: err ? 'Could not establish Reconnection.' : 'Reconnected Successfully.'
        };
        res.end(JSON.stringify(r));
      });
    } catch (err) {
      handleConnectionError(err, res);
    }
  } else {
    const r: api.ServerConnectionResponse = {
      success: false,
      msg: 'Client is already connected. A Reconnect must be reqeuested'
    };
    res.end(JSON.stringify(r));
  }
}


/**
 * Post Methode die den opc client mit der url in den params verbindet
 * @param params ServerConnectionOptions
 * @param res
 * @param next
 */
export function connectServer(params, res: Response, next: NextFunction) {
  /**
   * parameters expected in the args:
   * url (String)
   **/

  res.setHeader('Content-Type', 'application/json');

  if (params.body) {
    console.log(api.util.isValidServerConnection(params.body.value));
    if (api.util.isValidServerConnection(params.body.value)) {
      const options = params.body.value as api.ServerConnection;
      if (UAClientService.INSTANCE.isConnected()) {
        /*Client is already connected -> try to reconnect*/
        doReconnect(options, res);
        return;
      } else { // not yet connected
        try {
          doConnect(options, err => {
            const r: api.ServerConnectionResponse = {
              success: err ? false : true,
              msg: err ? 'Could not establish Connection.' : 'Connected Successfully.'
            };
            res.end(JSON.stringify(r));
          });
        } catch (err) {
          handleConnectionError(err, res);
        }
        return;
      }
    }
  } // body

  /* body is invalid*/
  const state: api.ServerConnectionResponse = {
    success: false,
    msg: 'Connecting to the reqeuested client failed, no valid body content.'
  }
  res.end(JSON.stringify(state));
}

function handleConnectionError(err: Error, res: Response) {
  res.end(JSON.stringify({
    success: false,
    msg: err.message || 'Connection failed due Connection Error'
  }));
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
  const serverState: api.ServerConnectionState = {
    connected: connected,
    endPointUrl: serverEndpoint || ''
  };
  res.end(JSON.stringify(serverState));
}

/**
 * connects a new opc client to an opc server -> needs valid endpointurl
 * @param options
 */
function doConnect(options: api.ServerConnection, cllback) {
  const client = UAClientService.INSTANCE.createClient({
    keepSessionAlive: options.keepSessionAlive || true,
    clientOptions: options.clientOptions || {}
  });
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
