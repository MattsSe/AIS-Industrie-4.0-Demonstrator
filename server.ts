import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as api from './routes';
import * as http from 'http';
import {UAClientService, UAClientProvider} from './opcua/ua.service';
import {UASocket} from './opcua/ua.socket';
import * as debugg from 'debug';

const debug = debugg('plant-ais:serve');
/**
 * The server.
 *
 * @class Server
 */
export class Server implements UAClientProvider {

  public static SERVING_PORT = 3000;

  private _uaSocket: UASocket;
  public app: express.Application;
  private _httpServer: http.Server;

  private httpPort: string | number;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  get uaSocket(): UASocket {
    return this._uaSocket;
  }

  protected setUASocket(socket: UASocket) {
    this._uaSocket = socket;
  }

  get httpServer(): http.Server {
    return this._httpServer;
  }

  protected setHttpServer(value: http.Server) {
    this._httpServer = value;
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // bootstrap expressjs application
    this.httpPort = this.normalizePort(process.env.PORT || Server.SERVING_PORT);

    this.app = express();

    this.app.set('port', this.httpPort);

    // set the HttpServer
    this.setHttpServer(http.createServer(this.app));

    // create the websocket listening on the server's port
    this.setUASocket(UASocket.create(this));

    // configure application
    this.config();

    // add routes
    this.routes();

    // add api
    this.api();

    this.listening();
  }

  /**
   * initializes the listening actions of the http server
   */
  protected listening() {
    // listen on provided ports
    this.httpServer.listen(this.httpPort);

    // a dd error handler
    this.httpServer.on('error', this.onError);

    // start listening on port
    this.httpServer.on('listening', this.onListening);
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    // Register the routes
    api.RegisterRoutes(this.app);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    // add static paths
    // this.app.use(express.static(path.join(__dirname, '../public')));

    // mount logger
    this.app.use(logger('dev'));

    // mount json form parser
    this.app.use(bodyParser.json());

    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // mount cookie parker
    this.app.use(cookieParser('SECRET_GOES_HERE'));


    // mount override?
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    // error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    // let router: express.Router;
    // router = express.Router();

    // use router middleware
    // this.app.use(router);
  }

  public opcuaService(): UAClientService {
    return UAClientService.INSTANCE;
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  protected onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof this.httpPort === 'string'
      ? 'Pipe ' + this.httpPort
      : 'Port ' + this.httpPort;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  protected onListening() {
    const bind = 'port ' + Server.SERVING_PORT;
    debug('Listening on ' + bind);
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

}
