/**
 * Created by Matthias on 31.08.17.
 */
const Jsonix = require('jsonix').Jsonix;
const path = require('path');
const fs = require('fs');
var PO = require('./PO').PO;

var UaNodeSet = require('./UaNodeset1').UaNodeset1;

var context = new Jsonix.Context([UaNodeSet], {
  namespacePrefixes: {
    "http://www.w3.org/2001/XMLSchema-instance": "xsi",
    "http://opcfoundation.org/UA/2008/02/Types.xsd": "uax",
    "http://opcfoundation.org/UA/2011/03/UANodeSet.xsd": "",
    "http://yourorganisation.org/example_nodeset/": "s1",
    "http://www.w3.org/2001/XMLSchema": "xsd"
  }
});
var unmarshaller = context.createUnmarshaller();

// unmarshaller.unmarshalFile(path.resolve(__dirname, 'nodeset.xml'),
//   // This callback function will be provided
//   // with the result of the unmarshalling
//   function (unmarshalled) {
//     // Alice Smith
//     var marshaller = context.createMarshaller();
//     var doc = marshaller.marshalString(unmarshalled);
//     console.log(doc);
//     fs.writeFileSync(path.resolve(__dirname, 'nodeset1.xml'), doc);
//   });

var marshaller = context.createMarshaller();

var doc = marshaller.marshalString({
  name: {
    localPart: "UANodeSet"
  },
  value: {
  }
});


console.log(doc);
