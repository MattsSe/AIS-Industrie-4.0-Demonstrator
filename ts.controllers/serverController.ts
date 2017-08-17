/**
 * Created by Matthias on 14.08.17.
 */
import {NextFunction, Request, Response, Router} from 'express';

/**
 * Utility Class to keep swagger gen code and write appropriated services externally in typescript
 */
export class ServerController {

  public static clearMonitoredItem(eq: Request, res: Response, next: NextFunction) {

  }

  public static clearMonitoredItems(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * limit (Integer)
     **/
    // no response value expected for this operation
    res.end();
  }

  public static getBrowseInfo(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * qualifiedName (String)
     **/
    const examples = {};
    examples['application/json'] = {};
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }

  public static getMonitoredItem(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     **/
    const examples = {};
    examples['application/json'] = [{}];
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static getMonitoredItems(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * limit (Integer)
     **/
    const examples = {};
    examples['application/json'] = [{}];
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static monitorItem(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     * attributeId (Integer)
     **/
    const examples = {};
    examples['application/json'] = {};
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static readVariableValue(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     **/
    const examples = {};
    examples['application/json'] = {
      'valid': true,
      'nodeId': 'aeiou',
      'value': 'aeiou'
    };
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static serverGET(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     **/
    const examples = {};
    examples['application/json'] = {};
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static serverUrlGET(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * url (String)
     **/
    const examples = {};
    examples['application/json'] = {};
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static serverUrlPOST(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * url (String)
     **/
    const examples = {};
    examples['application/json'] = {};
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

  public static writeVariableValue(req: Request, res: Response, next: NextFunction) {
    /**
     * parameters expected in the args:
     * nodeId (String)
     * value (String)
     **/
    const examples = {};
    examples['application/json'] = {
      'valid': true,
      'nodeId': 'aeiou',
      'value': 'aeiou'
    };
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }

  }

}
