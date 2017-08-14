/**
 * Created by Matthias on 14.08.17.
 */
import {Router} from 'express';
import {ServerController} from './ts.controllers/serverController';
import * as swaggerTools from 'swagger-tools';
import * as fs from 'fs';
import * as jsyaml from 'js-yaml';

/**
 * Registers all the used routes
 * @param app, express Application
 * @constructor
 */
export function RegisterRoutes(router: Router) {
  // const serverController = new ServerController();

  const options = {
    swaggerUi: '/swagger.json',
    controllers: './controllers',
    useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
  };

}
