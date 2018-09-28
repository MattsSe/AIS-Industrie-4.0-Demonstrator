import {UASocket} from '../opcua/ua.socket';
import {Messages} from '../opcua/messages';
import {defaults, util} from '../opcua/ua.util';
import {BehaviorSubject} from 'rxjs';
import * as api from '../../shared/models/index';
import {UAClient} from './UAClient';

import * as opcua from 'node-opcua';
import {provideSingleton} from '../../inversify/ioc';
import {MonitoredItemData} from '../../shared/models/index';

export interface UAClientProvider {
    opcuaService(): UAClientService;
}

interface MonitoredNodeData {
    nodeId: string,
    monitoredItem: opcua.ClientMonitoredItem
}

export function
toMonitoredItemData(value: MonitoredNodeData): MonitoredItemData {
    return {
        browseName: value.monitoredItem.itemToMonitor.nodeId.value,
        nodeId: value.monitoredItem.itemToMonitor.nodeId.toString(),
        attributeId: value.monitoredItem.itemToMonitor.attributeId,
        subscriptionId: value.monitoredItem.subscription.subscriptionId,
        value: '',
        datatype: '',
    };
}


/**
 * Created by Matthias on 16.08.17.
 */

@provideSingleton(UAClientService)
export class UAClientService {

    // TODO make this a singleton with ioc
    protected static _instance: UAClientService = null;

    private _client: UAClient;
    private _clientOptions: opcua.OPCUAClientOptions;
    private _subscription: opcua.ClientSubscription;
    private _session: opcua.ClientSession;
    private _socket: UASocket;
    private _endPointUrl = new BehaviorSubject<string>('');
    private latestMonitoredItemData = new BehaviorSubject<MonitoredNodeData>(null);
    private clientConnectionState = new BehaviorSubject<boolean>(false);
    private monitoredItemsListData: MonitoredNodeData[] = [];


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

    get client(): UAClient {
        return this._client;
    }

    set client(value: UAClient) {
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

    public getLatestMonitoredItemData(): MonitoredNodeData {
        return this.latestMonitoredItemData.getValue();
    }

    public latestMonitoredItemDataObservable() {
        return this.latestMonitoredItemData.asObservable();
    }

    public getAllMonitoredItemData(): MonitoredNodeData[] {
        return this.monitoredItemsListData;
    }

    public clientConnectionObservable() {
        return this.clientConnectionState.asObservable();
    }

    public isConnected() {
        return this.clientConnectionState.getValue();
    }

    public getCurrentConnectionState(): api.ServerConnectionState {
        return {
            connected: this.isConnected(),
            endPointUrl: this.endPointUrl
        };
    }

    /**
     * creates a new opcua client and sets it as #this.client value
     * @returns {opcua.OPCUAClient} the new created opcua client
     */
    public createClient(options?: opcua.OPCUAClientOptions): UAClient {
        const opt = options || this.clientOptions;
        if (opt.keepSessionAlive == null) {
            opt.keepSessionAlive = true;
        }
        this.client = new UAClient(opt);
        this.client.initListeners(this.socket);
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
            this.socket.logMessage(msg.join(' '));
        }
        // TODO remove when not dev
        console.log(msg);
    }


    /**
     *
     * @param url
     * @param callback
     */
    public connectClient(url: string, callback: opcua.ErrorCallback) {
        const _client = this.client || this.createClient();
        this.endPointUrl = url;
        try {
            _client.connect(url, err => {
                if (err) {
                    this.emitLogMessage(Messages.connection.refused, err.message);
                    callback(new Error('Connecting to Client failed.'));
                    this.clientConnectionState.next(false);
                } else {
                    this.emitLogMessage(Messages.connection.success);
                    this.clientConnectionState.next(true);
                    callback();
                }
            });
        } catch (err) {
            this.emitLogMessage('Connection exception', err.message)
            callback(err);
        }
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
    public disconnectAll(callback?: () => void) {
        if (!this.clientAvailable()) {
            this.emitLogMessage('Can\'t disconnect Client.');
            return;
        }
        if (this.sessionAvailable()) {
            this.disconnectSessionAndClient(callback);
        } else {
            this.disconnectClient(callback);
        }
    }

    public disconnectClient(callback?: () => void) {
        this.client.disconnect(() => {
            this.emitLogMessage(Messages.client.closed);
            this.clientConnectionState.next(false);
            this.endPointUrl = '';
            this.client = null;
            if (callback) {
                callback();
            }
        });
    }

    public disconnectSessionAndClient(callback?: () => void) {
        this.session.close(true, () => {
            this.disconnectClient(callback);
            this.session = null;
            this.subscription = null;
            this.monitoredItemsListData = [];
        });
    }


    /**
     * returns all directly nested elements in the element with the opcua.NodeId opcua.NodeId
     * @param opcua.NodeId
     * @param nodeId
     * @param callback
     */
    public browseChildren(nodeId: opcua.NodeId | string, callback: opcua.ResponseCallback<opcua.BrowseResult[]>) {
        if (!this.sessionAvailable()) {
            callback(new Error('session not vailable'));
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
            if (err) {
                callback(new Error('Could not browse children for nodeId: ' + nodeId + err.message));
                this.emitLogMessage('Could not browse the Session for Item with the node Id: ' + nodeId, err.message);
            } else {
                callback(err, results);
            }
        });
    }

    /**
     *
     * @param nodeId the nodeid to read all attributes of
     * @param callback
     */
    public readAllAttributes(nodeId: string | opcua.NodeId,
                             callback: (err: Error, nodesToRead: opcua.ReadValueId[],
                                        results?: opcua.DataValue[], diagnostic?: opcua.DiagnosticInfo[]) => void) {
        if (!this.sessionAvailable()) {
            return;
        }
        this.session.readAllAttributes(nodeId, (err, results) => {
            if (!err) {
                callback(err, results);
            } else {
                this.emitLogMessage('Could not read All Attributes for NodeId: ' + nodeId);
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
     * @param attributeId
     * @param requestParams
     * @param onChanged
     */
    public monitorItem(nodeId: opcua.NodeId, attributeId?: number,
                       requestParams?: opcua.ItemToMonitorRequestedParameters
        , onChanged?: (value) => void): opcua.ClientMonitoredItem {
        if (!this.subscriptionAvailable()) {
            if (this.session) {
                /*create a new subscription with default values anyway*/
                this.createSubscription();
            } else {
                this.emitLogMessage(Messages.session.missing, 'Create a session first before creating a subscription.');
                return null;
            }
        }
        const itemToMonitor: opcua.ReadValueId = {
            nodeId: nodeId,
            attributeId: attributeId || opcua.AttributeIds.Value
        };
        const params = requestParams ? requestParams : defaults.itemToMonitorRequestedParameters;
        const monitoredItem = this.subscription.monitor(itemToMonitor, params);

        if (onChanged) {
            monitoredItem.on('changed', v => onChanged(v));
        }

        this.emitLogMessage('Created new monitored item for nodeId: ' + nodeId);
        const latestData = {
            nodeId: nodeId.toString(),
            monitoredItem: monitoredItem
        };
        this.latestMonitoredItemData.next(latestData);
        return monitoredItem;
    }


    /**
     * removes any matching subscription for an item macthing the nodeId and if demanded
     * its attributeId
     * @param nodeId
     * @param attributeId
     * @param callback
     */
    public unmonitorItem(nodeId: opcua.NodeId | string, attributeId?: number, callback?: () => void): number {
        let counter = 0;
        const id = util.isNodeId(nodeId) ? nodeId.toString() : nodeId;
        this.monitoredItemsListData.forEach((value, index, array) => {
            if (value.nodeId === id) {
                let remove = true;
                if (attributeId) {
                    // skip if attributeId is demanded
                    remove = (attributeId === value.monitoredItem.itemToMonitor.attributeId);
                }
                if (remove) {
                    counter++;
                    value.monitoredItem.terminate(() => {
                        this.monitoredItemsListData.splice(index, 1);
                        this.emitLogMessage('Unmonitored Item with NodeId: ' + id);
                        if (callback) {
                            callback();
                        }
                    });
                }
            }
        });
        return counter;
    }

    /**
     * Removes all available MonitoredItems
     * @param limit
     */
    public unmonitorAll(limit?: number) {
        if (!this.subscriptionAvailable()) {
            return;
        }
        let max = limit || this.monitoredItemsListData.length;
        if (max > this.monitoredItemsListData.length) {
            max = this.monitoredItemsListData.length;
        }
        if (this.subscriptionAvailable()) {
            for (let index = 0; index < this.monitoredItemsListData.length; index++) {
                if (max === index) {
                    break;
                }
                const item = this.monitoredItemsListData[index];
                item.monitoredItem.terminate(() => {
                    this.emitLogMessage('Unmonitored Item: ' + item.nodeId);
                });
            }
            // remove alle local stored items
            this.monitoredItemsListData = this.monitoredItemsListData.slice(max);
        }
    }
}
