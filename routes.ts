/**
 * Created by Matthias on 14.08.17.
 */
import {Application} from 'express';
import {ServerController} from './ts.controllers/serverController';
import * as swaggerTools from 'swagger-tools';
import * as fs from 'fs';
import * as jsyaml from 'js-yaml';

/**
 * Registers all the used routes
 * @param app, express Application
 * @constructor
 */
export function RegisterRoutes(app: Application) {
  // const serverController = new ServerController();
  console.log('initt');
  const options = {
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
  };

  // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
  const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
  const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

  });

}
