import * as express from 'express';
import {UAClientService} from '../service/UAClientService';
import * as async from 'async';
import {provideSingleton} from '../../inversify/ioc';
import {Body, Delete, Get, Post, Query, Request, Route} from 'tsoa';
import {inject} from 'inversify';
import {ServerConnection, ServerConnectionResponse, ServerConnectionState} from '../../shared/models/index';


@provideSingleton(ConnectorController)
@Route('server')
export class ConnectorController {

    constructor(@inject(UAClientService) private clientService: UAClientService) {
    }

    async doReconnect(options: ServerConnection, res: express.Response) {
        if (typeof options.forceReconnect === 'boolean' && options.forceReconnect) {
            this.clientService.disconnectAll();
            const r: ServerConnectionResponse = {
                success: false
            };
            try {
                this.doConnect(options, err => {
                    r.success = !err;
                    r.msg = err ? 'Could not establish Reconnection.' : 'Reconnected Successfully.';
                    r.state = this.clientService.getCurrentConnectionState();
                });
            } catch (err) {
                this.handleConnectionError(err, res);
            } finally {
                res.end(JSON.stringify(r));
            }
        } else {
            const r: ServerConnectionResponse = {
                success: false,
                msg: 'Client is already connected. A Reconnect must be reqeuested',
                state: this.clientService.getCurrentConnectionState()
            };
            res.end(JSON.stringify(r));
        }
    }

    @Post()
    async connectServer(@Body() options: ServerConnection, @Request() request: express.Request) {

        if (this.clientService.isConnected()) {
            /*Client is already connected -> try to reconnect*/
            return this.doReconnect(options, request.res);
        } else { // not yet connected
            this.doConnect(options, err => {
                const r: ServerConnectionResponse = {
                    success: !err,
                    msg: err ? 'Could not establish Connection.' + err.message : 'Connected Successfully.',
                    state: this.clientService.getCurrentConnectionState()
                };
                request.res.end(JSON.stringify(r));
            });
        }
    }

    handleConnectionError(err: Error, res: express.Response) {
        res.end(JSON.stringify({
            success: false,
            msg: err.message || 'Connection failed due Connection Error',
            state: this.clientService.getCurrentConnectionState()
        }));
    }


    /**
     * connects a new opc client to an opc opcua -> needs valid endpointurl
     * @param options
     * @param cllback
     */
    doConnect(options: ServerConnection, cllback) {
        const clientOps = options.clientOptions || {};
        const client = this.clientService.createClient({
            keepSessionAlive: options.keepSessionAlive || true,
            connectionStrategy: clientOps.connectionStrategy || {},
            securityMode: clientOps.securityMode,
            securityPolicy: clientOps.securityPolicy,
            clientName: clientOps.clientName,
        });

        async.series([
                callback => {
                    this.clientService.connectClient(options.endpointUrl, callback);
                },
                callback => {
                    this.clientService.createSession(callback);
                }
            ],
            cllback
        );
    }

    /**
     * Checks if the client is connected to the url, url is a query param
     * @param url
     */
    @Get()
    async getServerConnectionState(@Query() url?: string): Promise<ServerConnectionState> {
        
        let connected = this.clientService.isConnected();
        const serverEndpoint = this.clientService.endPointUrl;
        if (url) {
            connected = connected && (serverEndpoint === url);
        }
        const serverState: ServerConnectionState = {
            connected: connected,
            endPointUrl: serverEndpoint || ''
        };
       return serverState;
    }

    /**
     * Closes any present clietn connection to a OPC UA Server
     * @DELETE
     * @param request
     */
    @Delete()
    async closeServerConnection(@Request() request: express.Request) {
        const connResp: ServerConnectionResponse = {
            success: true
        };
        if (this.clientService.isConnected()) {
            this.clientService.disconnectAll(() => {
                connResp.msg = 'No Client Connection successfully closed.';
                connResp.state = this.clientService.getCurrentConnectionState();
                request.res.end(JSON.stringify(connResp));
            });
        } else {
            connResp.msg = 'No Client Connection present.';
            connResp.state = this.clientService.getCurrentConnectionState();
            request.res.end(JSON.stringify(connResp));
        }
    }
}


