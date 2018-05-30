
// CoffeeOrder Service by Jakob Lammel
// Based on https://github.com/node-opcua/node-opcua/blob/master/documentation/server_with_method.js
// Node-opcua API documentation can be found here: http://node-opcua.github.io/api_doc/0.2.0/

/*CoffeeOrder Service is supposed to be an OPC UA Server that serves as a backend for the AIS Industrie 4.0 Demostrator.
Frontend Applications (e.g. the AIS_Demonstrator Android App by Florian Hänel) can establish a connection to the Service via the OPC UA endpoint URL.
The CoffeeOrder Service offers the following Services:
* ToDo

*/


/* Required packages */
var opcua = require("node-opcua");
var async = require("async");

// ToDo: implement MySQL database
// var mysql = require("mysql");

// Server Instantiation
var server = new opcua.OPCUAServer({
    port: 34197, // the port of the listening socket of the server
    resourcePath: "CoffeeOrder", // this path will be added to the endpoint resource name
	// defaultSecureTokenLifetime: 60000, // the default secure token life time in ms. /* Breaks the server for some reason. Error "Could not connect to server: BadInvalidArgument" */
	// securityPolicies= [SecurityPolicy.None, SecurityPolicy.Basic128Rsa15, SecurityPolicy.Basic256] // ToDo: Security Implementierung
	// securityModes= [MessageSecurityMode.NONE, MessageSecurityMode.SIGN, MessageSecurityMode.SIGNANDENCRYPT] // ToDo: Security Implementierung
	// allowAnonymous= true,	// Tells if the server default endpoints should allow anonymous connection. Default: true
	buildInfo : {
        productName: "CoffeeOrder_Service",
        buildNumber: "1.0",
        buildDate: new Date(2018,4,24)
    }
});

// Client Instantiation
// used for the OPC UA Client part of the CoffeeOrder_Service.
// This is NOT related to the Frontend (Android Application), instead this client is used to handle communication between the CoffeeOrder_Service and Codesys.
var client = new opcua.OPCUAClient();	// instantiate a new OPC UA Client
var client_session;	// 
// var client_subscription;	// the client subscription is used to get updates about variable changes from the CODESYS server
var CodesysEndpoint = "";	// the endpoint URL of the Codesys OPC UA Server


// declaration of internal Variables, used to handle the OPC UA Variables before writing them to a DB
var valueCoffeeLevel = 60;	//ToDo: initialize with 0, 100 is only for testing
var valueWaterLevel = 40;	//ToDo: initialize with 0, 100 is only for testing
var valueCleanlinessLevel = 100;	//ToDo: initialize with 0, 100 is only for testing
var valueCoffeeQuantity = 225;	//ToDo: initialize with 0, 225 is only for testing
var valueCoffeeStrength = 4;	//ToDo: initialize with 1, 4 is only for testing
var valueMilkQuantity = 25;	//ToDo: initialize with 0, 25 is only for testing

// Function that establishes a Client connection with the Codesys Server
async function ClientConnection () {
    async.series([

        // step 1 : connect to the CODESYS OPC UA Server
        function connect(callback)  {
            client.connect(CodesysEndpoint,function (err) {
                if (err) {
                    console.log("Cannot connect to Codesys endpoint URL: ", CodesysEndpoint);
                } else {
                    console.log("Connected to CODESYS Server!");
                }
                callback(err);
            });
        },
    
        // step 2 : create a new session 
        function createsession(callback) {
            client.createSession( function(err,session) { // creates a new Session with the "anonymous" Role
                if(!err) {
                    client_session = session;
                    console.log("Session created!");
                }
                else {
                    console.log("Error! Session could not be created! (CODESYS Server)");
                }
                callback(err);
            });
        },
        
        // step 5: install a subscription and install a monitored item for 10 seconds
        /*
        function(callback) {
           
           client_subscription=new opcua.ClientSubscription(client_session,{
               requestedPublishingInterval: 1000,
               requestedLifetimeCount: 20,
               requestedMaxKeepAliveCount: 2,
               maxNotificationsPerPublish: 10,
               publishingEnabled: true,
               priority: 10
           });
           
           client_subscription.on("started",function(){
               console.log("subscription started for 2 seconds - subscriptionId=",client_subscription.subscriptionId);
           }).on("keepalive",function(){
               console.log("keepalive");
           }).on("terminated",function(){
               console.log("terminated");
           });
           
           setTimeout(function(){
               client_subscription.terminate(callback);
           },15000);    // Terminate subscription after this time (in ms)
           
           // install monitored item
           var monitoredItem  = client_subscription.monitor({
               nodeId: opcua.resolveNodeId("ns=1;s=CoffeeLevel"),
               attributeId: opcua.AttributeIds.Value
           },
           {
               samplingInterval: 50, // "Abtastrate" in ms mit der der Wert des subscribed Attribute gelesen wird.
               discardOldest: true,
               queueSize: 5 // Bestimmt, wie groß die Queue (die Liste mit "gemerkten" Werten) ist.
           },
           opcua.read_service.TimestampsToReturn.Both
           );
           console.log("-------------------------------------");
           
           monitoredItem.on("changed",function(dataValue){
              // execute some code whenever the value of the monitored node changes
           });
        },
        */
    ],
    function(err) {
        if (err) {
            console.log("Async series failure: ",err);
        } else {
            console.log("Debug: Async series completed!");
        }
    }) ;
}
// Function that Closes the Client Connection
function ClientDisconnect () {
    client_session.close(function(err){
        if(err) {
            console.log("Session.close failed!");
        }
        else {
            console.log("Session closed.");
        }
    });
    client.disconnect(function(err){
        if(err) {
            console.log("Client.disconnect failed!");
        }
        else {
            console.log("Disconnected!");
        }
    })
}

function post_initialize() {
	
	//	function to construct the address space
	function construct_address_space(server) {
		var addressSpace = server.engine.addressSpace;
		
		// Add MachineState Object to the namespace
		var MachineStateObject = addressSpace.addObject({
			organizedBy: addressSpace.rootFolder.objects,
			browseName: "MachineState",
			displayName: "MachineState Object",
			description: "Das Objekt für die Maschinendaten der Kaffeemaschine. Enthält Variablen wie Kaffeestand, Wasserstand, Reinigungszustand, ... zur Verwendung für Monitoring.",
			nodeId: "ns=1;s=MachineState"	// The NodeID of the MachineState Object: NamespaceIndex = 1, IdentifierType = string, Identifier = MachineState
		});
		
		// Add CoffeeLevel Variable to MachineState Object
		var CoffeeLevel = addressSpace.addVariable({
			componentOf: MachineStateObject,
			dataType: opcua.DataType.UInt16,	// ToDo: Vielleicht eignet sich ein anderer Datentyp besser, noch mal evaluieren sobald ich die Daten im Frontend verwende.
			description: "Die Variable für den Kaffeestand in der Kaffeemaschine. Gibt an, wie voll der Kaffeebohnen- oder -pulverbehälter prozentual ist. Der Wert sollte also zwischen 0 (leer) und 100 (voll) liegen.",
			browseName: "CoffeeLevel",
			currentRead: 0,
			currentWrite: 1,
			nodeId: "ns=1;s=CoffeeLevel",	// The NodeID of the CoffeeLevel Object: NamespaceIndex = 1, IdentifierType = string, Identifier = CoffeeLevel
			value: {	// implements get and set functions for the value
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.UInt16, value: valueCoffeeLevel });
                },
                set: function (variant) {
                    valueCoffeeLevel = parseInt(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
		});
		
		// Add WaterLevel Variable to MachineState Object	
		var WaterLevel = addressSpace.addVariable ({
			componentOf: MachineStateObject,
			dataType: opcua.DataType.UInt16,	// ToDo: Vielleicht eignet sich ein anderer Datentyp besser, noch mal evaluieren sobald ich die Daten im Frontend verwende.
			description: "Die Variable für den Wasserstand in der Kaffeemaschine. Gibt an, wie voll der Wasserbehälter prozentual ist. Der Wert sollte also zwischen 0 (leer) und 100 (voll) liegen.",
			browseName: "WaterLevel",
			nodeId: "ns=1;s=WaterLevel",
			value: {	// implements get and set functions for the value
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.UInt16, value: valueWaterLevel });
                },
                set: function (variant) {
                    valueWaterLevel = parseInt(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
		});
		
		// Add Cleanliness Variable to MachineState Object
		var Cleanliness = addressSpace.addVariable ({
			organizedBy: MachineStateObject,
			dataType: opcua.DataType.UInt16,	// ToDo: Vielleicht eignet sich ein anderer Datentyp besser, noch mal evaluieren sobald ich die Daten im Frontend verwende.
			description: "Die Variable für die Sauberkeit der Kaffeemaschine. Gibt einen ungefähren Richtwert an, wie Sauber die Maschine ist. Der Wert sollte zwischen 100 (frisch gereinigt) und 0 (Reinigung steht an) liegen.",
			browseName: "Cleanliness",
			nodeId: "ns=1;s=Cleanliness",
			value: {	// implements get and set functions for the value
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.UInt16, value: valueCleanlinessLevel });
                },
                set: function (variant) {
                    valueCleanlinessLevel = parseInt(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
		});
		
		// ToDo: add Enum Datatype for Control Panel Buttons in Codesys

		
		// Add CoffeeOrder Object to the namespace
		var CoffeeOrderObject = addressSpace.addObject({
			organizedBy: addressSpace.rootFolder.objects,
			browseName: "CoffeeOrder",
			displayName: "CoffeeOrder Object",
			description: "Das Objekt für eine Kaffeebestellung. Enthält Variablen für die Kaffee- und Milchmenge sowie für die Kaffeestärke. Außerdem stellt es Methoden bereit, mit der man die Kaffeebestellung an die Steuerung weitergeben kann.",
			nodeId: "ns=1;s=CoffeeOrder"	// The NodeID of the CoffeeOrder Object: NamespaceIndex = 1, IdentifierType = string, Identifier = CoffeeOrder
		});
		
		// Add CoffeeQuantity Variable to CoffeeOrder Object
		CoffeeQuantity = addressSpace.addVariable({
			componentOf: CoffeeOrderObject,
			browseName: "CoffeeQuantity",
			nodeId: "ns=1;s=CoffeeQuantityVariable",
			dataType: opcua.DataType.UInt16,
			description: "Die Variable für die Kaffeemenge, in ml.",
			value: {	// implements get and set functions for the value
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.UInt16, value: valueCoffeeQuantity });
                },
                set: function (variant) {
                    valueCoffeeQuantity = parseInt(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
		});
		
		// Add MilkQuantity Variable to CoffeeOrder Object
		CoffeeQuantity = addressSpace.addVariable({
			componentOf: CoffeeOrderObject,
			browseName: "MilkQuantity",
			nodeId: "ns=1;s=MilkQuantityVariable",
			dataType: opcua.DataType.UInt16,
			description: "Die Variable für die Milchmenge, in ml.",
			value: {	// implements get and set functions for the value
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.UInt16, value: valueMilkQuantity });
                },
                set: function (variant) {
                    valueMilkQuantity = parseInt(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
		});
		
		// Add CoffeeStrength Variable to CoffeeOrder Object
		CoffeeQuantity = addressSpace.addVariable({
			componentOf: CoffeeOrderObject,
			browseName: "CoffeeStrength",
			nodeId: "ns=1;s=CoffeeStrengthVariable",
			dataType: opcua.DataType.UInt16,
			description: "Die Variable für die Kaffeestärke. Möglich sind die Werte {1, 2, 3, 4, 5}.",
			value: {	// implements get and set functions for the value
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.UInt16, value: valueCoffeeStrength });
                },
                set: function (variant) {
                    valueCoffeeStrength = parseInt(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
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
	//	end of declaration
	
    console.log("initialized");
	construct_address_space(server);	// Call function to construct the server address space.

}

// actual program starts here

server.initialize(post_initialize);

server.start(function () {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
	console.log("port ", server.endpoints[0].port);
    var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" the primary server endpoint url is ", endpointUrl );
	setInterval(function(){	// This function displays the current number of Subscriptions handled by the server every 15 seconds
			console.log("Aktuelle Anzahl an Subscriptions: ", server.currentSubscriptionCount);
			}, 15000)
});
