import * as opcua from 'node-opcua';
import {UASocket} from './ua.socket';
import {Messages} from './messages';
import * as async from 'async';


export interface UAClientProvider {
  opcuaService(): UAClientService;
}

/**
 * Created by Matthias on 16.08.17.
 */

export class UAClientService {

  protected static _instance: UAClientService = null;

  private _client: opcua.OPCUAClient;
  private _clientOptions: opcua.OPCUAClientOptions;
  private _session: opcua.ClientSession;
  private _socket: UASocket;
  private _endPointUrl: string;

  private asyncQueue: AsyncQueue<void>;

  public static get INSTANCE(): UAClientService {
    if (UAClientService._instance == null) {
      UAClientService._instance = new UAClientService();
    }
    return UAClientService._instance;
  }

  constructor() {
  }

  get client(): opcua.OPCUAClient {
    return this._client;
  }

  set client(value: opcua.OPCUAClient) {
    this._client = value;
  }

  get clientOptions(): opcua.OPCUAClientOptions {
    return this._clientOptions;
  }

  set clientOptions(value: opcua.OPCUAClientOptions) {
    this._clientOptions = value;
  }

  get session(): opcua.ClientSession {
    return this._session;
  }

  set session(value: opcua.ClientSession) {
    this._session = value;
  }

  get socket(): UASocket {
    return this._socket;
  }

  set socket(value: UASocket) {
    this._socket = value;
  }

  get endPointUrl(): string {
    return this._endPointUrl;
  }

  set endPointUrl(value: string) {
    this._endPointUrl = value;
  }

  /**
   * creates a new opcua client and sets it as #this.client value
   * @returns {opcua.OPCUAClient} the new created opcua client
   */
  public createClient(options?: opcua.OPCUAClientOptions): opcua.OPCUAClient {
    const opt = options || this.clientOptions;
    this.client = new opcua.OPCUAClient(opt);
    this.emitLogMessage('Created new Client');
    return this.client;
  }

  /**
   * Emits the msg to connected client sockets
   * @param msg
   */
  public emitLogMessage(...msg: string[]) {
    // TODO socket only available in production
    if (this.socket) {
      this.socket.emit('ualogger', msg);
    } else {
      console.log('socket not available, msg was: ' + msg);
    }
  }


  /**
   *
   * @param url
   */
  public async connectClient(url: string, callback?: opcua.ErrorCallback) {
    const _client = this.client || this.createClient();
    _client.connect(url, err => {
      if (err) {
        this.emitLogMessage(Messages.connection.refused, err.message);
        if (callback) {
          callback(new Error('Connecting to Client failed.'));
        }
      } else {
        this.emitLogMessage(Messages.connection.success);
        if (callback) {
          callback();
        }
      }
    });
  }

  /**
   *
   */
  public createSession(callack: opcua.ResponseCallback<opcua.ClientSession>) {
    if (!this.clientAvailable()) {
      this.emitLogMessage('Can\'t bootstrap new Session.');
      return callack(new Error('No Client available'));
    }
    this.client.createSession((err, session) => {
      if (err) {
        this.emitLogMessage(Messages.session.creationFailed, err.message);
      } else {
        this.session = session;
        this.emitLogMessage(Messages.session.created);
      }
      callack(err, session);
    });
  }

  /**
   *
   * @param deleteSubscriptions
   */
  public closeSession(deleteSubscriptions?: boolean) {
    if (!this.sessionAvailable()) {
      return;
    }
    const deleteSubs = deleteSubscriptions || true;
    this.session.close(deleteSubs, () => this.emitLogMessage(Messages.session.closed));
  }


  /**
   *
   * @returns {boolean}
   */
  protected sessionAvailable(): boolean {
    if (!this.session) {
      this.emitLogMessage(Messages.session.missing);
      return false;
    }
    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  protected clientAvailable(): boolean {
    if (!this.client) {
      this.emitLogMessage(Messages.client.missing);
      return false;
    }
    return true;
  }

  /**
   *
   * @param nodeToBrowse
   * @param callback
   */
  public browseSession(nodeToBrowse: opcua.CoercibleToBrowseDescription,
                       callback: opcua.ResponseCallback<opcua.BrowseResponse>) {
    if (!this.sessionAvailable()) {
      return;
    }
    this.session.browse(nodeToBrowse, (err, browse_result) => {
      callback(err, browse_result);
    });
  }


  public disconnectClient() {
    if (!this.clientAvailable()) {
      this.emitLogMessage('Can\'t disconnect Client.');
      return;
    }
    this.client.disconnect(() => {
      this.emitLogMessage(Messages.client.closed);
    })
  }

  public getAsyncQueue() {
    if (!this.asyncQueue) {
      this.asyncQueue = async.queue((task, callback) => {
        callback();
      })
      this.asyncQueue.drain = () => console.log('All task finished in the asyncQueue');
    }
    return this.asyncQueue;
  }


  /**
   * returns all directly nested elements in the element with the opcua.NodeId opcua.NodeId
   * @param opcua.NodeId
   * @param callback
   */
  public browseChildren(nodeId: opcua.NodeId, callback: opcua.ResponseCallback<opcua.BrowseResponse[]>) {
    if (!this.sessionAvailable()) {
      return;
    }
    const b: opcua.CoercibleToBrowseDescription[] = [
      {
        nodeId: nodeId,
        referenceTypeId: 'Organizes',
        includeSubtypes: true,
        browseDirection: opcua.BrowseDirection.Forward,
        resultMask: 0x3f

      },
      {
        nodeId: nodeId,
        referenceTypeId: 'Aggregates',
        includeSubtypes: true,
        browseDirection: opcua.BrowseDirection.Forward,
        resultMask: 0x3f  // indicating which fields in the ReferenceDescription should be returned in the results.
      }
    ];

    this.session.browse(b, (err, results) => {
      if (!err) {
        callback(err, results);
      } else {
        this.emitLogMessage('Could not browse the Session for Item with the node Id: ' + nodeId.value);
      }
    });
  }

  public readAllAttributes(nodeId: opcua.NodeId,
                           callback: (err: Error, nodesToRead: opcua.ReadValueId[],
                                      results: opcua.DataValue[], diagnostic: opcua.DiagnosticInfo[]) => void) {
    if (!this.sessionAvailable()) {
      return;
    }
    this.session.readAllAttributes([nodeId], (err, nodesToRead, results, diagnostic) => {
      if (!err) {
        callback(err, nodesToRead, results, diagnostic);
      } else {
        this.emitLogMessage('Could not read All Attributes for NodeId: ' + nodeId.value);
      }
    })
  }


}
