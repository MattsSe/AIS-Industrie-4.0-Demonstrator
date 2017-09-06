/**
 * Created by Matthias on 31.08.17.
 */
import * as opcua from 'node-opcua';
import * as builder from 'xmlbuilder';
import * as schema from '../../mappings/UaNodeset';
import Jsonix = require('jsonix');
import * as path from 'path';
export interface UANodeSet extends NameSpaces {
  NamespaceUris: NamespaceUris;
  Aliases: Aliases;
}
export interface NameSpaces {
  '@xmlns:xsi'?: string,
  '@xmlns:uax'?: string,
  '@xmlns'?: string,
  '@xmlns:s1'?: string,
  '@xmlns:xsd'?: string
}

export interface NamespaceUris {
  Uri?: string[];
}

export interface Aliases {
  Alias?: Alias;
}
export interface Alias {
  '@Alias': string,
  'Alias': string,
}

export class NodesetToXmlGenerator {

  public xml: any;

  constructor() {

  }


  // public dumpUADataType(xw, node) {
  //   xw.startElement('UADataType');
  //   xw.writeAttribute('NodeId', node.nodeId.toString());
  //   xw.writeAttribute('BrowseName', node.browseName.toString());
  //
  //   if (node.isAbstract) {
  //     xw.writeAttribute('IsAbstract', node.isAbstract ? 'true' : 'false');
  //   }
  //   _dumpReferences(xw, node);
  //
  //   _dumpUADataTypeDefinition(xw, node);
  //
  //   xw.endElement();
  // }
}
// const node: UANodeSet = {
//   '@xmlns': 'dummy',
//   NamespaceUris: {
//     Uri: ['b', 'c'],
//   },
//   Aliases: [{
//     '@Alias': 'Boolean',
//     '#text': 'i58'
//   }]
// };
// const feedObj = {
//   'UANodeSet': node
// };
// const feed = builder.create(feedObj, {encoding: 'utf-8'})
// console.log(feed.end({pretty: true}));
const context = new Jsonix.Jsonix.Context([schema.UaNodeset]);
const marshaller = context.createMarshaller();
const unmarshaller = context.createUnmarshaller();

const nodeset = {
  name: 'NamespaceUris',
  value: []
};
// const doc = marshaller.marshalDocument(nodeset);
console.log(context.elementInfos);
