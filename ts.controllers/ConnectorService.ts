/**
 * Created by Matthias on 23.08.17.
 */
import {NextFunction, Response} from 'express';
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
    UAClientService.INSTANCE.disconnectAll();
    try {
      doConnect(options, err => {
        const r: api.ServerConnectionResponse = {
          success: err ? false : true,
          msg: err ? 'Could not establish Reconnection.' : 'Reconnected Successfully.',
          state: UAClientService.INSTANCE.getCurrentConnectionState()
        };
        res.end(JSON.stringify(r));
      });
    } catch (err) {
      handleConnectionError(err, res);
    }
  } else {
    const r: api.ServerConnectionResponse = {
      success: false,
      msg: 'Client is already connected. A Reconnect must be reqeuested',
      state: UAClientService.INSTANCE.getCurrentConnectionState()
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
    if (api.util.isValidServerConnection(params.body.value)) {
      const options = params.body.value as api.ServerConnection;
      if (UAClientService.INSTANCE.isConnected()) {
        /*Client is already connected -> try to reconnect*/
        doReconnect(options, res);
        return;
      } else { // not yet connected
        doConnect(options, err => {
          const r: api.ServerConnectionResponse = {
            success: err ? false : true,
            msg: err ? 'Could not establish Connection.' + err.message : 'Connected Successfully.',
            state: UAClientService.INSTANCE.getCurrentConnectionState()
          };
          res.end(JSON.stringify(r));
        });
        return;
      }
    }
  } // body

  /* body is invalid*/
  const state: api.ServerConnectionResponse = {
    success: false,
    msg: 'Connecting to the reqeuested client failed, no valid body content.',
    state: UAClientService.INSTANCE.getCurrentConnectionState()
  }
  res.end(JSON.stringify(state));
}

function handleConnectionError(err: Error, res: Response) {
  res.end(JSON.stringify({
    success: false,
    msg: err.message || 'Connection failed due Connection Error',
    state: UAClientService.INSTANCE.getCurrentConnectionState()
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
export function doConnect(options: api.ServerConnection, cllback) {
  const clientOps = options.clientOptions || {};
  const client = UAClientService.INSTANCE.createClient({
    keepSessionAlive: options.keepSessionAlive || true,
    connectionStrategy: clientOps.connectionStrategy || {},
    securityMode: clientOps.securityMode,
    securityPolicy: clientOps.securityPolicy,
    clientName: clientOps.clientName,
  });
  async.series([
      callback => {
        UAClientService.INSTANCE.connectClient(options.endpointUrl, callback);
      },
      callback => {
        UAClientService.INSTANCE.createSession(callback);
      }
    ],
    cllback
  );
}


/**
 * Closes any present clietn connection to a OPC UA Server
 * @DELETE
 * @param params
 * @param res
 * @param next
 */
export function closeServerConnection(params, res: Response, next: NextFunction) {
  const connResp: api.ServerConnectionResponse = {
    success: true
  };
  if (UAClientService.INSTANCE.isConnected()) {
    UAClientService.INSTANCE.disconnectAll(() => {
      connResp.msg = 'No Client Connection successfully closed.'
      connResp.state = UAClientService.INSTANCE.getCurrentConnectionState();
      res.end(JSON.stringify(connResp));
    });
  } else {
    connResp.msg = 'No Client Connection present.'
    connResp.state = UAClientService.INSTANCE.getCurrentConnectionState();
    res.end(JSON.stringify(connResp));
  }
}
