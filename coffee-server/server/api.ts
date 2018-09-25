/**
 * Created by Matthias on 13.08.17.
 */
import {NextFunction, Request, Response, Router} from 'express';
import * as status from 'http-status';

export class ApiRoute {

  public static create(router: Router) {
    // add home page route
    router.get('/api', (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().index(req, res, next);
    });
  }

  constructor() {
  }

  public index(req: Request, res: Response, next: NextFunction) {
    console.log('api dummy called');
    res.status(status.OK).send({
      message: 'dummy message'
    })
  }

}
