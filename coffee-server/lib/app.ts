import * as express from "express";
import * as bodyParser from "body-parser";
import * as errorhandler from 'strong-error-handler';
import {Routes} from "./routes/crmRoutes";
import {config} from "./utils";

/**
 * Wrapper class around the underlying express application
 */
class App {

    /**
     * the action express application
     */
    public app: express.Application;

    /**
     * installs the routes
     */
    public routePrv: Routes = new Routes();
    
    public mongoUrl: string = config.connectionString();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);

        this.app.use(errorhandler({
            debug: process.env.ENV !== 'prod',
            log: true,
        }));
    }

    private config(): void {
        this.app.use(bodyParser.json());
        // middleware for parsing application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({extended: true}));
        
        // serving static files 
        this.app.use(express.static('public'));
        // enable corse for all origins
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Expose-Headers", "x-total-count");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
            res.header("Access-Control-Allow-Headers", "Content-Type,authorization");

            next();
        });
    }
}

export default new App().app;