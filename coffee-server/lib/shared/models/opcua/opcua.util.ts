import * as models from './models';

export namespace util {

  export function isValidServerConnection(obj: any): obj is models.ServerConnection {
    return (typeof obj.endpointUrl === 'string');
  }

}
