/**
 * Created by Matthias on 17.08.17.
 */
import * as async from 'async';
import {UAClientService} from './ua.service';
import {
  BrowseResult,
  BrowseDescription,
  BrowseDirection,
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  ClientSession, browse_service, resolveNodeId
} from 'node-opcua';
const service = new UAClientService();

// service.endPointUrl = 'opc.tcp://opcua.demo-this.com:51210/UA/SampleServer';
service.endPointUrl = 'opc.tcp://localhost:4334/UA/MyLittleServer';

const client = service.createClient();

async.series([

  callback => {
    service.connectClient(service.endPointUrl, callback);
  },
  callback => {
    service.createSession(callback);
  },
  callback => {
    service.fetchChildren(resolveNodeId('RootFolder'), (err, response) => {
      console.log(response);
      callback();
    });
  },
  // callback => {
  //
  //   service.session.browse('RootFolder', function (err: Error | null, result: BrowseResult) {
  //     if (err) {
  //       return callback(err);
  //     }
  //     console.log(result.toString());
  //     callback();
  //   });
  // },
  //
  // callback => {
  //
  //   service.session.browse(['RootFolder'], function (err: Error | null, result: Array<BrowseResult>) {
  //     if (err) {
  //       return callback(err);
  //     }
  //     console.log(result[0].toString());
  //     callback();
  //   });
  // },
  // callback => {
  //
  //   const browseDescription: BrowseDescription = {
  //     browseDirection: BrowseDirection.Forward,
  //     nodeId: 'RootFolder'
  //   };
  //   service.session.browse(browseDescription, function (err: Error | null, result: Array<BrowseResult>) {
  //     if (err) {
  //       return callback(err);
  //     }
  //     console.log(result[0].toString());
  //     callback();
  //   });
  // },


  callback => {
    client.closeSession(service.session, false, callback);
  },
  callback => {
    client.disconnect(function (err?: Error | null) {
      callback(err);
    });
  },


], function (err: Error) {
  console.log('done', err);
});


