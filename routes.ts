/**
 * Created by Matthias on 14.08.17.
 */
import {Router} from 'express';
import {ServerController} from './controllers/serverController';

/**
 * Registers all the used routes
 * @param app, express Application
 * @constructor
 */
export function RegisterRoutes(router: Router) {
  const serverController = new ServerController();


}
