
// CoffeeOrder Service by Jakob Lammel
// Based on https://github.com/node-opcua/node-opcua/blob/master/documentation/server_with_method.js
// Node-opcua API documentation can be found here: http://node-opcua.github.io/api_doc/0.2.0/

/*CoffeeOrder Service is supposed to be an OPC UA Server that serves as a backend for the AIS Industrie 4.0 Demostrator.
Frontend Applications (e.g. the AIS_Demonstrator Android App by Florian Hänel) can establish a connection to the Service via the OPC UA endpoint URL.
The CoffeeOrder Service offers the following Services:
* ToDo

*/


/* global console, require */
var opcua = require("node-opcua");


// instantiate Server
var server = new opcua.OPCUAServer({
    port: 34197, // the port of the listening socket of the server
    resourcePath: "CoffeeOrder", // this path will be added to the endpoint resource name
	// defaultSecureTokenLifetime: 60000, // the default secure token life time in ms. /* Breaks the server for some reason. Error "Could not connect to server: BadInvalidArgument" */
	// securityPolicies= [SecurityPolicy.None, SecurityPolicy.Basic128Rsa15, SecurityPolicy.Basic256] // ToDo: Security Implementierung
	// securityModes= [MessageSecurityMode.NONE, MessageSecurityMode.SIGN, MessageSecurityMode.SIGNANDENCRYPT] // ToDo: Security Implementierung
	buildInfo : {
        productName: "MeinTestServer2",
        buildNumber: "12345",
        buildDate: new Date(2018,4,24)
    }
});

function post_initialize() {
    console.log("initialized");
    var addressSpace = server.engine.addressSpace;
	
	// ToDo: add Enum Datatype for Control Panel Buttons in Codesys

	
	// Add CoffeeOrder Object to the namespace
    var CoffeeOrderObject = addressSpace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "CoffeeOrder",
		displayName: "CoffeeOrder Object",
		description: "Das Objekt für eine Kaffeebestellung. Enthält Variablen für die Kaffee- und Milchmenge sowie für die Kaffeestärke. Außerdem stellt es Methoden bereit, mit der man die Kaffeebestellung an die Steuerung weitergeben kann.",
		nodeId: "ns=1;s=CoffeeOrder"	// die NodeID des CoffeeOrder Objects
    });
	
	// Add CoffeeQuantity Variable to CoffeeOrder Object
	CoffeeQuantity = addressSpace.addVariable({
		componentOf: CoffeeOrderObject,
		browseName: "CoffeeQuantity",
		dataType: opcua.DataType.UInt16
	});
	
	// Add MilkQuantity Variable to CoffeeOrder Object
	CoffeeQuantity = addressSpace.addVariable({
		componentOf: CoffeeOrderObject,
		browseName: "MilkQuantity",
		dataType: opcua.DataType.UInt16
	});
	
	// Add CoffeeStrength Variable to CoffeeOrder Object
	CoffeeQuantity = addressSpace.addVariable({
		componentOf: CoffeeOrderObject,
		browseName: "CoffeeStrength",
		dataType: opcua.DataType.Byte
	});
	
    var toButtonMethod = addressSpace.addMethod(CoffeeOrderObject, {		// ToDo: Here we add the method shell (without the actual functional logic) to the OPC UA Server Address Space
		
		browseName: "toButton",
		
		// These are the Input Arguments that must be passed to the method upon calling it
		inputArguments: [
			{
				name: "CoffeeQuantity",
				description: {text: "Die Menge an Kaffee in der Bestellung, in ml"},
				dataType: opcua.DataType.UInt32
			},
			{
				name: "MilkQuantity",
				description: {text: "Die Menge an Milch in der Bestellung, in ml"},
				dataType: opcua.DataType.UInt32
			}
		],
		
		// These are the output arguments that the method returns when called
		outputArguments: [
			{
				name: "buttonToPress",
				description: {text: "Virtueller Knopf auf dem Bedienpanel, der in CODESYS die Kaffeemaschine bedient"},
				dataType: opcua.DataType.UInt32 // ToDo: change to my enum datatype CPbutton
			}
		]
	/*
        browseName: "Bell",

        inputArguments: [
            {
                name: "nBells",
                description: {text: "spezifiziert wie oft der Server kläffen soll"},
                dataType: opcua.DataType.UInt32
            }, {
                name: "lautstaerke",
                description: {text: "spezifiziert die Größe des Hundes [0 = klein ,100 = groß]"},
                dataType: opcua.DataType.UInt32
            }
        ],

        outputArguments: [{
            name: "Bells",
            description: {text: "Die generierten Laute"},
            dataType: opcua.DataType.String,
            valueRank: 1
        }]
		*/
    });

    // optionally, we can adjust userAccessLevel attribute
    //toButtonMethod.outputArguments.userAccessLevel = opcua.makeAccessLevel("CurrentRead");
    //toButtonMethod.inputArguments.userAccessLevel = opcua.makeAccessLevel("CurrentRead");
    

    /* toButtonMethod.bindMethod(function (inputArguments, context, callback) {	// ToDo: Here we add functional logic to the created method shell.
		
		// actual method logic code
		
        // local variables for internal use within the function
		var nbBarks = inputArguments[0].value;
        var volume = inputArguments[1].value;

        console.log("Hallo Nachbar, ich werde ", nbBarks, " mal Bellen!");
        console.log("Meine Größe ist ca. ", volume, " von 100");
        var sound_volume = Array(volume).join("!");

        var barks = [];
        for (var i = 0; i < nbBarks; i++) {
            barks.push("Whaff" + sound_volume);
        }

        var callMethodResult = {
            statusCode: opcua.StatusCodes.Good,
            outputArguments: [{
                dataType: opcua.DataType.String,
                arrayType: opcua.VariantArrayType.Array,
                value: barks
            }]
        };
        callback(null, callMethodResult);
		
    });*/

}

server.initialize(post_initialize);

server.start(function () {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
	console.log("port ", server.endpoints[0].port);
    var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" the primary server endpoint url is ", endpointUrl );
});