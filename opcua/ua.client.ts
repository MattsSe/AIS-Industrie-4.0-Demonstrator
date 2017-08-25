import * as opcua from 'node-opcua';
import {UASocket} from './ua.socket';
/**
 * Created by Matthias on 25.08.17.
 */

export interface UAClientData {
  reconnectionCount: number,
  tokenRenewalCount: number,
  receivedBytes: number,
  sentBytes: number,
  sentChunks: number,
  receivedChunks: number,
  backoffCount: number,
  transactionCount: 0
}

export class UaClient extends opcua.OPCUAClient {

  private data: UAClientData;
  private socket: UASocket;

  constructor(options?: opcua.OPCUAClientOptions) {
    super(options);
    this.resetData();
  }

  public resetData() {
    this.data = {
      reconnectionCount: 0,
      tokenRenewalCount: 0,
      receivedBytes: 0,
      sentBytes: 0,
      sentChunks: 0,
      receivedChunks: 0,
      backoffCount: 0,
      transactionCount: 0
    };
  }

  public initListeners(socket: UASocket) {
    this.socket = socket;
    const _data = this.data;
    const self = this;
    this.on('send_request', function () {
      _data.transactionCount++;
    });

    this.on('send_chunk', function (chunk) {
      _data.sentBytes += chunk.length;
      _data.sentChunks++;
    });

    this.on('receive_chunk', function (chunk) {
      _data.receivedBytes += chunk.length;
      _data.receivedChunks++;
    });

    this.on('backoff', function (number, delay) {
      _data.backoffCount += 1;
      socket.logMessage(`backoff  attempt #${number} retrying in ${delay / 1000.0} seconds`);
    });

    this.on('start_reconnection', function () {
      socket.logMessage(' !!!!!!!!!!!!!!!!!!!!!!!!  Starting reconnection !!!!!!!!!!!!!!!!!!! ' );
    });

    this.on('connection_reestablished', function () {
      socket.logMessage(' !!!!!!!!!!!!!!!!!!!!!!!!  CONNECTION RE-ESTABLISHED !!!!!!!!!!!!!!!!!!! ' );
      _data.reconnectionCount++;
    });

// monitoring des lifetimes
    this.on('lifetime_75', function (token) {
      if (argv.verbose) {
        socket.logMessage('received lifetime_75 on ' )
      }
    });

    this.on('security_token_renewed', function () {
      _data.tokenRenewalCount += 1;
      if (argv.verbose) {
        socket.logMessage(' security_token_renewed on ' );
      }
    });
  }
}
