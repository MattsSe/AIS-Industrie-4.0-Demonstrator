// /**
//  * Created by Matthias on 17.08.17.
//  */
// import * as async from 'async';
// import {UAClientService} from './ua.service';
// import {
//   BrowseResult,
//   BrowseDescription,
//   BrowseDirection,
//   OPCUAClient,
//   MessageSecurityMode,
//   SecurityPolicy,
//   ClientSession, browse_service, resolveNodeId, DataTypeIds, StatusCodes
// } from 'node-opcua';
// import * as _ from 'underscore';
// import {util} from './ua.util';
// const service = new UAClientService();
//
// // service.endPointUrl = 'opc.tcp://opcua.demo-this.com:51210/UA/SampleServer';
// service.endPointUrl = 'opc.tcp://localhost:4334/UA/MyLittleServer';
//
// const client = service.createClient();
//
// async.series([
//
//   callback => {
//     service.connectClient(service.endPointUrl, callback);
//   },
//   callback => {
//     service.createSession(callback);
//   },
//   callback => {
//     service.createSubscription();
//     const item = service.monitorItem(resolveNodeId('ns=1;s=free_memory'));
//     // item.on('changed', v => console.log(v.value.value));
//     item.on('initialized', v => callback());
//     item.on('terminated', v => console.log('terminated'));
//
//   },
//   callback => {
//     console.log('called');
//     service.unmonitorItem(service.getLatestMonitoredItemData().nodeId, () => {
//       console.log(service.getAllMonitoredItemData());
//       callback();
//     });
//   },
//   callback => {
//     service.readAllAttributes(resolveNodeId('ns=1;s=free_memory'), (err, nodesToRead, dataValues, diagnostic) => {
//
//         for (let i = 0; i < nodesToRead.length; i++) {
//
//           const nodeToRead = nodesToRead[i];
//           const dataValue = dataValues[i];
//
//           if (dataValue.statusCode !== StatusCodes.Good) {
//             continue;
//           }
//           const s = util.toString1(nodeToRead.attributeId, dataValue);
//           console.log(util.attributeIdtoString[nodeToRead.attributeId] + '   ' + s);
//         }
//         callback();
//       }
//     )
//   },
//   // callback => {
//   //   service.browseChildren(resolveNodeId('RootFolder'), (err, response) => {
//   //     console.log(response);
//   //     callback();
//   //   });
//   // },
//   // callback => {
//   //
//   //   service.session.browse('RootFolder', function (err: Error | null, result: BrowseResult) {
//   //     if (err) {
//   //       return callback(err);
//   //     }
//   //     console.log(result.toString());
//   //     callback();
//   //   });
//   // },
//   //
//   // callback => {
//   //
//   //   service.session.browse(['RootFolder'], function (err: Error | null, result: Array<BrowseResult>) {
//   //     if (err) {
//   //       return callback(err);
//   //     }
//   //     console.log(result[0].toString());
//   //     callback();
//   //   });
//   // },
//   // callback => {
//   //
//   //   const browseDescription: BrowseDescription = {
//   //     browseDirection: BrowseDirection.Forward,
//   //     nodeId: 'RootFolder'
//   //   };
//   //   service.session.browse(browseDescription, function (err: Error | null, result: Array<BrowseResult>) {
//   //     if (err) {
//   //       return callback(err);
//   //     }
//   //     console.log(result[0].toString());
//   //     callback();
//   //   });
//   // },
//
//
//   callback => {
//     client.closeSession(service.session, true, callback);
//   },
//   callback => {
//     client.disconnect(function (err?: Error | null) {
//       callback(err);
//     });
//   },
//
//
// ], function (err: Error) {
//   console.log('done', err);
// });
//
//
