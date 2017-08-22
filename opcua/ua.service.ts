import * as opcua from 'node-opcua';
import {UASocket} from './ua.socket';
import {Messages} from './messages';
import * as async from 'async';
import {defaults, util} from './ua.util';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


export interface UAClientProvider {
  opcuaService(): UAClientService;
}

interface MonitoredItemData {
  nodeId: string,
  monitoredItem: opcua.ClientMonitoredItem
}

/**
 * Created by Matthias on 16.08.17.
 */

export class UAClientService {

  protected static _instance: UAClientService = null;

  private _client: opcua.OPCUAClient;
  private _clientOptions: opcua.OPCUAClientOptions;
  private _subscription: opcua.ClientSubscription;
  private _session: opcua.ClientSession;
  private _socket: UASocket;
  private _endPointUrl = new BehaviorSubject<string>('');
  private latestMonitoredItemData = new BehaviorSubject<MonitoredItemData>(null);
  private clientConnectionState = new BehaviorSubject<boolean>(false);
  private monitoredItemsListData: MonitoredItemData[] = [];

  public static get INSTANCE(): UAClientService {
    if (UAClientService._instance == null) {
      UAClientService._instance = new UAClientService();
    }
    return UAClientService._instance;
  }

  constructor() {
    /*store history*/
    this.latestMonitoredItemData.subscribe(next => this.monitoredItemsListData.push(next));
    /*need to initialize again preventing null value at first index*/
    this.monitoredItemsListData = [];
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
    return this._endPointUrl.getValue();
  }

  set endPointUrl(value: string) {
    this._endPointUrl.next(value);
  }

  public endPointUrlObservable() {
    return this._endPointUrl.asObservable();
  }

  get subscription(): opcua.ClientSubscription {
    return this._subscription;
  }

  set subscription(value: opcua.ClientSubscription) {
    this._subscription = value;
  }

  public getLatestMonitoredItemData(): MonitoredItemData {
    return this.latestMonitoredItemData.getValue();
  }

  public latestMonitoredItemDataObservable() {
    return this.latestMonitoredItemData.asObservable();
  }

  public getAllMonitoredItemData(): MonitoredItemData[] {
    return this.monitoredItemsListData;
  }

  public clientConnectionObservable() {
    return this.clientConnectionState.asObservable();
  }

  public isConnected() {
    return this.clientConnectionState.getValue();
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
    this.endPointUrl = url;
    _client.connect(url, err => {
      if (err) {
        this.emitLogMessage(Messages.connection.refused, err.message);
        if (callback) {
          callback(new Error('Connecting to Client failed.'));
          this.clientConnectionState.next(false);
        }
      } else {
        this.emitLogMessage(Messages.connection.success);
        this.clientConnectionState.next(true);
        console.log('connected the client');
        console.log('state is ' + this.isConnected());
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
  protected subscriptionAvailable(): boolean {
    if (!this.subscription) {
      this.emitLogMessage(Messages.subscription.missing);
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


  /**
   *
   * @param callback
   */
  public disconnectClient(callback?: () => void) {
    if (!this.clientAvailable()) {
      this.emitLogMessage('Can\'t disconnect Client.');
      return;
    }
    this.client.disconnect(() => {
      this.emitLogMessage(Messages.client.closed);
      this.clientConnectionState.next(false);
      if (callback) {
        callback();
      }
    })
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

  /**
   *
   * @param nodeId the nodeid to read all attributes of
   * @param callback
   */
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

  /**
   *
   * @param subscriptionOptions
   */
  public createSubscription(subscriptionOptions?: opcua.ClientSubscriptionOptions) {
    if (!this.sessionAvailable()) {
      return;
    }
    const options = subscriptionOptions ? subscriptionOptions : defaults.subscriptionOptions;
    this.subscription = new opcua.ClientSubscription(this.session, options);
    this.emitLogMessage('ClientSubscription created.');
  }


  /**
   *
   * @param nodeId
   * @param requestParams
   */
  public monitorItem(nodeId: opcua.NodeId, requestParams?: opcua.ItemToMonitorRequestedParameters): opcua.ClientMonitoredItem {
    if (!this.subscriptionAvailable()) {
      if (this.session) {
        /*create a new subscription with default values anyway*/
        this.createSubscription();
      } else {
        this.emitLogMessage(Messages.session.missing, 'Create a session first before creating a subscription.');
        return null;
      }
    }
    const itemToMonitor: opcua.ItemToMonitor = {
      nodeId: nodeId,
      attributeId: opcua.AttributeIds.Value
    };
    const params = requestParams ? requestParams : defaults.itemToMonitorRequestedParameters;
    const monitoredItem = this.subscription.monitor(itemToMonitor, params);
    this.emitLogMessage('Created new monitored item for nodeId: ' + nodeId);
    const latestData: MonitoredItemData = {
      nodeId: nodeId.toString(),
      monitoredItem: monitoredItem
    }
    this.latestMonitoredItemData.next(latestData);
    return monitoredItem;
  }


  /**
   *
   * @param nodeId
   */
  public unmonitorItem(nodeId: opcua.NodeId | string, callback?: () => void) {
    const id = util.isNodeId(nodeId) ? nodeId.toString() : nodeId;
    this.monitoredItemsListData.forEach((value, index, array) => {
      if (value.nodeId === id) {
        value.monitoredItem.terminate(() => {
          this.monitoredItemsListData.splice(index, 1);
          this.emitLogMessage('Unmonitored Item with NodeId: ' + id);
          if (callback) {
            callback();
          }
        });
      }
    })
  }
}
