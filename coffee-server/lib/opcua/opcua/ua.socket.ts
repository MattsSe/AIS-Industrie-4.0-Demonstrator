import * as io from 'socket.io';
import {UASocketEmitter} from './ua.emitter';
import {Server} from '../server';
import Namespace = SocketIO.Namespace;
import * as api from '../../shared/models/index';
import * as SocketIO from 'socket.io';

export class UASocket {
    private readonly io: SocketIO.Server;
    private _emitter: UASocketEmitter;
    private subscriptions: Namespace;

    public static create(server: Server) {
        return new UASocket(server);
    }


    get emitter(): UASocketEmitter {
        return this._emitter;
    }

    set emitter(value: UASocketEmitter) {
        this._emitter = value;
    }

    public getSocket() {
        return this.io;
    }

    /**
     *
     * @param server
     */
    constructor(private server: Server) {
        this.io = io().listen(server.httpServer);
        this._emitter = new UASocketEmitter(this, this.server.opcuaService())
    }

    private init() {
        const _io = this.io;
        _io.on('connection', function (socket) {
            console.log('Socket connected');
            // Socket event for gist created
            socket.on('gistSaved', function (gistSaved) {
                _io.emit('gistSaved', gistSaved);
                console.log('gistsave called on opcua');
            });
            // Socket event for gist updated
            socket.on('gistUpdated', function (gistUpdated) {
                _io.emit('gistUpdated', gistUpdated);
            });
        });
    }

    /**
     * Delegate Method to the acutal emitterservice (this.emitter.emit...)
     * @param event
     * @param args
     * @returns {Namespace}
     */
    public emit(event: string, ...args: any[]) {
        return this.emitter.emit(event, args);
    }


    /**
     * Loggs any occuring message through the socket
     * @param args
     */
    public logMessage(...args: string[]) {
        this.io.emit('ualogging', args);
    }

    public emitSubscriptionChange(item: api.MonitoredItemData) {
        this.io.emit('monitored', item);
    }

}
