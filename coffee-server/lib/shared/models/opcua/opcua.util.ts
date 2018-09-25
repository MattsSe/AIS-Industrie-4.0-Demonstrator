import * as models from './index';

export namespace util {

  export function isValidServerConnection(obj: any): obj is models.ServerConnection {
    return (typeof obj.endpointUrl === 'string');
  }

}
