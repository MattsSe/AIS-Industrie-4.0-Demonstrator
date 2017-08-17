import {ClientSession, OPCUAClient, OPCUAClientOptions} from 'node-opcua';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UASocket} from './ua.socket';
import {Messages} from './messages';
/**
 * Created by Matthias on 16.08.17.
 */

export class UAClientService {

  private _client: OPCUAClient;
  private _clientOptions: OPCUAClientOptions;
  private _session: ClientSession;
  private _socket: UASocket;
  private _endPointUrl: string;


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
    this.client = new OPCUAClient(options);
    this.emitLogMessage('Created new Client');
    return this.client;
  }

  /**
   * Emits the msg to connected client sockets
   * @param msg
   */
  public emitLogMessage(...msg: string[]) {
    this.socket.emit('ualogger', msg);
  }


  public connectClient(url: string) {
    const _client = this.client || this.createClient();
    _client.connect(url, err => {
      if (err) {
        this.emitLogMessage(Messages.connection.refused, err.message);
      } else {
        this.emitLogMessage(Messages.connection.success);
      }
    });
  }

  public createSession() {
    if (!this.client) {
      this.emitLogMessage('No connected client present. Can\'t create new session.');
    }
    this.client.createSession((err, session) => {
      if (err) {
        this.emitLogMessage('Creating new Session failed: ', err.message);
        return;
      }
      this.session = session;
      this.emitLogMessage(Messages.session.created);
    });
  }


  public disconnectClient() {
  }


}
