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
const CodesysEndpoint = "opc.tcp://JakobsDesktop:4840"; // "opc.tcp://JAKOBSDESKTOP:34197/CoffeeOrder";
const NodeID_intCoffeeStrength = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.iButtonStatus[11]"; // NodeID of the variable for the current CoffeeStrength. Ranges from 0 ("Sehr Mild") to 4 ("Sehr Kräftig")
const NodeID_boolSmallCoffee = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[2]";        // NodeID of the Switch to produce a small Coffee
const NodeID_boolMediumCoffee = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[3]";       // NodeID of the Switch to produce a medium Coffee    
const NodeID_boolLargeCoffee = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[4]";        // NodeID of the Switch to produce a large Coffee
const NodeID_boolCappuccino = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[1]";         // NodeID of the Switch to produce a Cappuccino
const NodeID_boolCoffeeStrength = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[11]";         // NodeID of the Switch to cycle through the Coffee Strength
const NodeID_intPackMLStatus = "ns=4;s=|var|CODESYS Control Win V3.Application.Glob_Var.CM_PackML_Status";              // NodeID of the global Codesys Variable "CM_PackML_Status"
const NodeID_stringPackMLStatus = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.sPackMLStatus";    // NodeID of the PackML Status Variable as a String within FB_CoffeeMachineOperation
// About PackML Status:
/* PackML Status is a custom Enum Data Type created within the Codesys Program. The Enum type is called "PackML_Status".
Sadly OPC UA does not provide this custom Datatype, so it should be handled as an int in this program. */


// local representation of the current settings of the Coffee Machine (taken from Codesys)
var codesys_intPackMLStatus = 0;  // Global Variable where the subscription saves changed values of the PackML Status 
var codesys_stringPackMLStatus = "";  // Global Variable where the subscription saves changed values of the PackML Status 
var codesys_coffeeStrength; // Global Variable where the subscription saves changed values of the Coffee Strength
var codesys_serverStatus;


// declaration of internal Variables, used to handle the OPC UA Variables before writing them to a DB
var valueCoffeeLevel = 60;	//ToDo: initialize with 0, 100 is only for testing
var valueWaterLevel = 40;	//ToDo: initialize with 0, 100 is only for testing
var valueCleanlinessLevel = 100;	//ToDo: initialize with 0, 100 is only for testing
var valueCoffeeQuantity = 225;	//ToDo: initialize with 0, 225 is only for testing
var valueCoffeeStrength = 4;	//ToDo: initialize with 1, 4 is only for testing
var valueMilkQuantity = 25;	//ToDo: initialize with 0, 25 is only for testing
var cooldown = false;	// Helper varaible used to flag the toButton Method as "on cooldown", meant to be used with a timer which resets the flag after cooldownTime seconds
var cooldowntime = 10;	// Default value for the cooldown in seconds

// Function that establishes a Client connection with the Codesys Server
async function ClientConnection () {
    async.series([

        // step 1 : connect to the CODESYS OPC UA Server
        function connect(callback)  {
            client.connect(CodesysEndpoint,function (err) {
                if (err) {
                    console.log("Client: Cannot connect to Codesys endpoint URL: ", CodesysEndpoint);
                } else {
                    console.log("Client: Connected to CODESYS OPC UA Server at Endpoint URL: ", CodesysEndpoint);
                }
                callback(err);
            });
        },
    
        // step 2 : create a new session 
        function createsession(callback) {
            client.createSession( function(err,session) { // creates a new Session with the "anonymous" Role
                if(!err) {
                    client_session = session;
                    console.log("Client: Session created!");
                }
                else {
                    console.log("Client: Error! Session could not be created! (CODESYS Server)");
                }
                callback(err);
            });
        },
        
        // step 3: install a subscription and add monitored items
        function (callback) {

            subscription_Codesys = new opcua.ClientSubscription(client_session, {
                requestedPublishingInterval: 100,   // Publish information about monitored items every 100 ms (from Codesys to Backend)
                requestedLifetimeCount: 20,  // Counter
                requestedMaxKeepAliveCount: 2,   // Counter
                maxNotificationsPerPublish: 1,  // Counter
                publishingEnabled: true,
                priority: 10 // Byte
            });

            subscription_Codesys.on("started", function () {
                console.log("Client: subscription started for 30 seconds - subscriptionId=", subscription_Codesys.subscriptionId);
            }).on("keepalive", function () {
                console.log("Client: Subscription Keelapive: Der PackML Status ist immer noch: ", dataValue.value.value);
            }).on("terminated", function () {
                console.log("Client: subscription terminated!");
            });

            /* setTimeout(function () {
                subscription_Codesys.terminate(callback);
            }, 15000); */    // ToDo Delete: Terminate subscription after this time (in ms)

            // install monitored items
            var monitoredItem_intPackMLStatus = subscription_Codesys.monitor({ // monitoring mode is automatically set to "reporting"
                nodeId: NodeID_intPackMLStatus,   // opcua.resolveNodeId("ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.sPackMLStatus"),
                attributeId: opcua.AttributeIds.Value
            },
                {
                    samplingInterval: 100, // Check PackMLSTatus Value every 100ms (Only handles how often CODESYS checks the value internally, see requestedPublishingInterval to adjust "how often backend receives updated values")
                    discardOldest: true, // if true: only keeps the most recent value. We don't need to know the history of the PackMLStatus, therefore this should be true.
                    filter: null,    // Not needed; Filters can be used to only show value changes greater than a set tolerance
                    queueSize: 1 // We don't need to know the history of the PackMLStatus, therefore only the newest value is needed in the queue
                },
			);
			var monitoredItem_stringPackMLStatus = subscription_Codesys.monitor({ // monitoring mode is automatically set to "reporting"
                nodeId: NodeID_stringPackMLStatus,   // opcua.resolveNodeId("ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.sPackMLStatus"),
                attributeId: opcua.AttributeIds.Value
            },
                {
                    samplingInterval: 100, // Check PackMLSTatus Value every 100ms (Only handles how often CODESYS checks the value internally, see requestedPublishingInterval to adjust "how often backend receives updated values")
                    discardOldest: true, // if true: only keeps the most recent value. We don't need to know the history of the PackMLStatus, therefore this should be true.
                    filter: null,    // Not needed; Filters can be used to only show value changes greater than a set tolerance
                    queueSize: 1 // We don't need to know the history of the PackMLStatus, therefore only the newest value is needed in the queue
                },
			);
			var monitoredItem_ServerStatus = subscription_Codesys.monitor({ // monitoring mode is automatically set to "reporting"
                nodeId: "ns=0;i=2259",   // this nodeID is specified as the server status nodeID in OPC UA specs, part 4, 6.7 
                attributeId: opcua.AttributeIds.Value
            },
                {
                    samplingInterval: 100, // Check PackMLSTatus Value every 100ms (Only handles how often CODESYS checks the value internally, see requestedPublishingInterval to adjust "how often backend receives updated values")
                    discardOldest: true, // if true: only keeps the most recent value. We don't need to know the history of the PackMLStatus, therefore this should be true.
                    filter: null,    // Not needed; Filters can be used to only show value changes greater than a set tolerance
                    queueSize: 1 // We don't need to know the history of the PackMLStatus, therefore only the newest value is needed in the queue
                },
            );
            var monitoredItem_CoffeeStrength = subscription_Codesys.monitor({ // monitoring mode is automatically set to "reporting"
                nodeId: NodeID_intCoffeeStrength,   // opcua.resolveNodeId("ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.sPackMLStatus"),
                attributeId: opcua.AttributeIds.Value
            },
                {
                    samplingInterval: 100, // Check CoffeeStrength Value every 100ms (Only handles how often CODESYS checks the value internally, see requestedPublishingInterval to adjust "how often backend receives updated values")
                    discardOldest: true, // if true: only keeps the most recent value. We don't need to know the history of the CoffeeStrength, therefore this should be true.
                    filter: null,    // Not needed; Filters can be used to only show value changes greater than a set tolerance.
                    queueSize: 1 // We don't need to know the history of the CoffeeStrength, therefore only the newest value is needed in the queue.
                },
                opcua.read_service.TimestampsToReturn.Neither    // Timestamps are not needed for the Coffee machine
            );

            monitoredItem_intPackMLStatus.on("changed", function (dataValue) {
                // execute some code whenever the value of the monitored node changes
                codesys_intPackMLStatus = dataValue.value.value;
                console.log("Subscription: PackML Status ist jetzt: ", codesys_intPackMLStatus);
			});
			monitoredItem_stringPackMLStatus.on("changed", function (dataValue) {
                // execute some code whenever the value of the monitored node changes
                codesys_stringPackMLStatus = dataValue.value.value;
                console.log("Subscription: PackML Status ist jetzt: ", codesys_stringPackMLStatus);
            });
            monitoredItem_CoffeeStrength.on("changed", function (dataValue) {
                // execute some code whenever the value of the monitored node changes
                codesys_coffeeStrength = 1 + dataValue.value.value;	// here we compensate for the fact that the coffeestrength in codesys ranges from 0 to 4 while in the frontend it ranges from 1 to 5
                console.log("Subscription: CoffeeStrength ist jetzt: ", codesys_coffeeStrength);
            });
            monitoredItem_ServerStatus.on("changed", function (dataValue) {
                // execute some code whenever the value of the monitored node changes
                codesys_serverStatus = dataValue.value.value;
                if (codesys_serverStatus != 0) {
                    console.log("ACHTUNG: CODESYS Server Status ist nicht mehr 'running'! ");
                }
            });
        }
    ],
    function(err) {
        if (err) {
            console.log("Client: Async series failure: ",err);
		} /* else {
			console.log("Debug: Async series completed!");
		} */
    }) ;
}
// Function that Closes the Client Connection
function ClientDisconnect () {
    client_session.close(function(err){
        if(err) {
            console.log("Client: Session.close failed!");
        }
        else {
            console.log("Client: Session closed.");
        }
    });
    client.disconnect(function(err){
        if(err) {
            console.log("Client: Client.disconnect failed!");
        }
        else {
            console.log("Client: Disconnected!");
        }
    })
}

function resetCooldown(){	// resets the cooldown when called. Should be called with: setTimeout(() => resetCooldown(), (cooldowntime*1000));
	cooldown = false;
}

// The function pressButton is used within the toButton Method to "Press the Buttons" in Codesys. It takes the NodeID (in the Codesys OCP UA Namespace) of the button that is to be pressed .
function pressButton(buttonToPressNodeID) {
    console.log("Sending Coffee Order to Codesys...");
    var nodeToWrite = {		// this is the object which represents the write data. It consists of the actual value and some extra contextual data that is needed by the Codesys OPC UA Server.
        nodeId: buttonToPressNodeID,
        attributeId: opcua.AttributeIds.Value,
        value: {
            statusCode: opcua.StatusCodes.Good,
            value: {
                dataType: opcua.DataType.Boolean,
                value: true	// this is the actual data value that is written to Codesys
            }
        }
    }
    client_session.write(nodeToWrite, function (err, statusCode) {
        if (err) {
            console.log("Client: Write Error: ", err);
			return callback(err);
        }
        console.log("Client: Write Response Status Code: ", statusCode.name);
        if (statusCode == opcua.StatusCodes.Good) { // "if the button was pressed successfully"
            nodeToWrite.value.value.value = false;    // We need to set the Button Status  to false in order to "un-press" the button. This is done 500ms after the first write has returned a 'Good' Status Code
            setTimeout(() => client_session.write(nodeToWrite, function (err, statusCode2) {
                if (err) {
                    console.log("Client: Write Reset Error: ", err);
					return callback(err);
                }
                // console.log("Client Debug: Write Reset Response Status Code: ", statusCode2.name);
            }), 500);   // Timer for the Reset, should be ~ 500 [ms]
            // console.log("Client Debug: Write Status Code Good");
        }
        else {
            console.log("Bad Status Code: ", statusCode.name);
		}
    });
}

// The function post_initialize is used to construct the OPC UA address space for the CoffeeOrder Service. It also contains the toButton method's implementation.
async function post_initialize() {
	
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
			nodeId: "ns=1;s=toButtonMethod",
			description: "Diese Methode löst die Kaffeebestellung an der Kaffeemaschine (über die CODESYS Steuerung) aus. Zuerst wird die Kaffeestärke auf der Kaffeemaschine korrekt eingestellt. Danach entscheidet die Methode anhand der internen Variablen des CoffeeOrder Node, ob ein kleiner/mittlerer/großer Kaffee oder ein Cappuccino am ehesten zu den Werten passt und löst schließlich die passende Produktion aus.",
			
			//	These would be the Input Arguments that must be passed to the method upon calling it.
			//	Not needed since the Method uses the internal values (valueCoffeeQuantity and valueMilkQuantity) 
			/*	
			inputArguments: [
				{
					name: "CoffeeQuantity",
					description: {text: "Die Menge an Kaffee in der Bestellung, in ml"},
					dataType: opcua.DataType.UInt16
				},
			],
			*/
			
			//	These are the output arguments that the method returns when called
			outputArguments: [
				{
					name: "MethodResponse",
					description: {text: "Informationen über das Resultat des Method Calls."},
					dataType: opcua.DataType.String
				}
			]
		});

		toButtonMethod.bindMethod(function (v, context, callback) {	// ToDo: Here we add functional logic to the created method shell.
			// local variables
			var ResultMessage = "Hoppla, die Methode wurde nicht ausgeführt!";	// Default Result Message
			var callMethodResult = {
				statusCode: opcua.StatusCodes.Bad,	// Initialize with status code "Bad", only set to good once method executed successfully
				outputArguments: [{
					dataType: opcua.DataType.String,
					value: ResultMessage
				}]
			};
			// actual method logic code goes here
			if (cooldown == true) {
				ResultMessage = "Method on cooldown";	// Todo debug uncomment line below instead
				// ResultMessage = "Es wird gerade ein Kaffee zubereitet, bitte warten Sie einen Moment.";
				callMethodResult.outputArguments.value = ResultMessage;
			}
			else {
				if (codesys_intPackMLStatus != 0) {
					ResultMessage = "Fehler: die Kaffeemaschine ist gerade nicht betriebsbereit!";
					callMethodResult.outputArguments.value = ResultMessage;
				}
				else {	// Method currently not on cooldown and Coffee Machine is in IDLE Mode
					cooldown = true;	// Flag Method for Cooldown
					setTimeout(() => resetCooldown(), (cooldowntime * 1000));	// reset cooldown after (cooldowntime) seconds
					if (!client_session) {	// checks if the session is null
						ResultMessage = "Fehler: keine Session beim Codesys Server!";
						callMethodResult.outputArguments.value = ResultMessage;
					}
					else {	// at this point we have validated cooldown, session and packML state

						if (codesys_coffeeStrength != valueCoffeeStrength) {
							// set the correct coffe strength
							var difference = valueCoffeeStrength - codesys_coffeeStrength;
							if (codesys_coffeeStrength > valueCoffeeStrength) {
								difference += 5;
							}
							console.log("Debug: Desired Coffeestrength: ", valueCoffeeStrength);
							console.log("Debug: Current Coffeestrength: ", codesys_coffeeStrength);
							console.log("Debug: Button will be pressed ", difference, " times.");
							async.whilst(	// documentation of async.whilst:	https://caolan.github.io/async/docs.html#whilst
								function () {return difference > 0},	// this is the test for the whilst function: call the next function as long as "difference is not null"
								function (callback) {
									pressButton(NodeID_boolCoffeeStrength);
									difference--;
									setTimeout(callback, 1000);
								},
								function (err) {
									console.log("Debug: async.whilst completed");
								}
							);
							callMethodResult.statusCode = opcua.StatusCodes.Good;
							/*for (i=0; i < difference; i++) {
								setTimeout(() => pressButton(NodeID_boolCoffeeStrength, 1000));
								console.log("Debug: Button has been pressed ", 1+i, " time(s).");
							}*/
						}
					}
				}
			}
			callback(null, callMethodResult);

			// EXAMPLE BELOW

			// local variables for internal use within the function
			/*
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
			*/
			
			// END OF EXAMPLE
			
		});

	}
    console.log("Server: initialized");
	construct_address_space(server);	// Call function to construct the server address space.

}


//		*********************************
//		*								*
//		*	ACTUAL PROGRAM STARTS HERE	*
//		*								*
//		*********************************


server.initialize(post_initialize);		// initialize the server and construct the address space
ClientConnection();						// connect to Codesys
server.start(function () {
	console.log("Server is now listening ... ( press CTRL+C to stop)");
	console.log("Server port: ", server.endpoints[0].port);
	var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
	console.log("Server: the primary server endpoint url is ", endpointUrl);
	/* setInterval(function () {	// This function displays the current number of Subscriptions handled by the server every 15 seconds
		console.log("Server: current number of active subscriptions: ", server.currentSubscriptionCount);
	}, 15000) */
});
