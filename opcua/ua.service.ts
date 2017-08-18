import {
  BrowseResponse, ClientSession, CoercibleToBrowseDescription, OPCUAClient, OPCUAClientOptions,
  ResponseCallback, ErrorCallback, browse_service, NodeId
} from 'node-opcua';
import {UASocket} from './ua.socket';
import {Messages} from './messages';
import * as async from 'async';

/**
 * Created by Matthias on 16.08.17.
 */

export class UAClientService {

  private _client: OPCUAClient;
  private _clientOptions: OPCUAClientOptions;
  private _session: ClientSession;
  private _socket: UASocket;
  private _endPointUrl: string;
  private asyncQueue: AsyncQueue<void>;

  constructor() {
  }

  get client(): OPCUAClient {
    return this._client;
  }

  set client(value: OPCUAClient) {
    this._client = value;
  }

  get clientOptions(): OPCUAClientOptions {
    return this._clientOptions;
  }

  set clientOptions(value: OPCUAClientOptions) {
    this._clientOptions = value;
  }

  get session(): ClientSession {
    return this._session;
  }

  set session(value: ClientSession) {
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
   * @returns {OPCUAClient} the new created opcua client
   */
  public createClient(options?: OPCUAClientOptions): OPCUAClient {
    const opt = options || this.clientOptions;
    this.client = new OPCUAClient(opt);
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
  public async connectClient(url: string, callback?: ErrorCallback) {
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
  public createSession(callack: ResponseCallback<ClientSession>) {
    if (!this.clientAvailable()) {
      this.emitLogMessage('Can\'t create new Session.');
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
  public browseSession(nodeToBrowse: CoercibleToBrowseDescription,
                       callback: ResponseCallback<BrowseResponse>) {
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


  public fetchChildren(nodeId: NodeId, callback: ResponseCallback<object[]>) {

    const children = [];

    const b = [
      {
        nodeId: nodeId,
        referenceTypeId: 'Organizes',
        includeSubtypes: true,
        browseDirection: browse_service.BrowseDirection.Forward,
        resultMask: 0x3f

      },
      {
        nodeId: nodeId,
        referenceTypeId: 'Aggregates',
        includeSubtypes: true,
        browseDirection: browse_service.BrowseDirection.Forward,
        resultMask: 0x3f
      }
    ];

    this.session.browse(b, (err, results) => {
      if (!err) {
        const result = results[0];
        for (let i = 0; i < result.references.length; i++) {
          const ref = result.references[i];
          children.push({
            browseName: ref.browseName.toString(),
            nodeId: ref.nodeId,
            class: ref.class,
            children: this.fetchChildren
          });
        }
      }

      callback(err, children);
    });

  }

}
