/*global require,console,setTimeout */
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();
// var CodesysEndpoint = "opc.tcp://" + require("os").hostname() + ":34197/UA/Testserver";
const CodesysEndpoint = "opc.tcp://JakobsDesktop:4840"; // "opc.tcp://JAKOBSDESKTOP:34197/CoffeeOrder";
const NodeID_intCoffeeStrength = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.iButtonStatus[11]"; // NodeID of the variable for the current CoffeeStrength. Ranges from 0 ("Sehr Mild") to 4 ("Sehr Kräftig")
const NodeID_boolSmallCoffee = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[2]";        // NodeID of the Switch to produce a small Coffee
const NodeID_boolMediumCoffee = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[3]";       // NodeID of the Switch to produce a medium Coffee    
const NodeID_boolLargeCoffee = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[4]";        // NodeID of the Switch to produce a large Coffee
const NodeID_boolCappuccino = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.arrSwitch[1]";         // NodeID of the Switch to produce a Cappuccino
const NodeID_intPackMLStatus = "ns=4;s=|var|CODESYS Control Win V3.Application.Glob_Var.CM_PackML_Status";              // NodeID of the global Codesys Variable "CM_PackML_Status"
const NodeID_stringPackMLStatus = "ns=4;s=|var|CODESYS Control Win V3.Application.Main.fbCMOperation.sPackMLStatus";    // NodeID of the PackML Status Variable as a String within FB_CoffeeMachineOperation
var codesys_packMLStatus = "";  // Global Variable where the subscription saves changed values of the PackML Status 
var codesys_coffeeStrength = 0; // Global Variable where the subscription saves changed values of the Coffee Strength
var codesys_serverStatus;
// About PackML Status:
/* PackML Status is a custom Enum Data Type created within the Codesys Program. The Enum type is called "PackML_Status".
Sadly OPC UA does not provide this custom Datatype, so it should be handled as an int in this program. */


var client_session;
var subscription_Codesys;

async function ClientConnection() {
    async.series([  // async is used to ensure each of the following functions are executed only if the previous function is completed
        // step 1 : connect to the CODESYS OPC UA Server
        function connect(callback) {
            client.connect(CodesysEndpoint, function (err) {
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
            client.createSession(function (err, session) { // creates a new Session with the "anonymous" Role
                if (!err) {
                    client_session = session;
                    console.log("Client: Session created!");
                }
                else {
                    console.log("Client: Error! Session could not be created! (CODESYS Server)");
                }
                callback(err);
            });
        },
        /*
        function readTest(callback) {
            var nodeToRead = {
                nodeId: NodeID_stringPackMLStatus,
                attributeId: opcua.AttributeIds.Value
            };

            console.log("Client: Test reading...");
            setTimeout(() => client_session.read(nodeToRead, function (err, dataValue) {
                if (!err) {
                    console.log(dataValue.value.value);
                }
                callback(err);
            }), 2000);
        }, */

        // step 5: install a subscription and install a monitored item for 10 seconds

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

            setTimeout(function () {
                subscription_Codesys.terminate(callback);
            }, 45000);    // Terminate subscription after this time (in ms)

            // install monitored items
            var monitoredItem_PackMLStatus = subscription_Codesys.monitor({ // monitoring mode is automatically set to "reporting"
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

            monitoredItem_PackMLStatus.on("changed", function (dataValue) {
                // execute some code whenever the value of the monitored node changes
                codesys_packMLStatus = dataValue.value.value;
                console.log("Subscription: PackML Status ist jetzt: ", codesys_packMLStatus);
            });
            monitoredItem_CoffeeStrength.on("changed", function (dataValue) {
                // execute some code whenever the value of the monitored node changes
                codesys_coffeeStrength = dataValue.value.value;
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
        function (err) {
            if (err) {
                console.log("Client: Async series failure: ", err);
            } else {
                console.log("Debug: Async series completed!");
            }
        });
}

// Function that Closes the Client Connection
function ClientDisconnect() {
    client_session.close(function (err) {
        if (err) {
            console.log("Client: Session.close failed!");
        }
        else {
            console.log("Client: Session closed.");
        }
    });
    client.disconnect(function (err) {
        if (err) {
            console.log("Client: Client.disconnect failed!");
        }
        else {
            console.log("Client: Disconnected!");
        }
    })
}

function pressButton(buttonToPressNodeID) {
    console.log("Client: Attempting to write...");
    var nodeToWrite = {
        nodeId: buttonToPressNodeID,
        attributeId: opcua.AttributeIds.Value,
        value: {
            statusCode: opcua.StatusCodes.Good,
            value: {
                dataType: opcua.DataType.Boolean,
                value: true
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
                console.log("Client: Write Reset Response Status Code: ", statusCode2.name);
            }), 500);   // Timer for the Reset, should be ~ 500 [ms]
            console.log("Write Status Code Good");
        }
        else {
            console.log("Bad Status Code: ", statusCode.name);
        }
    });
}


ClientConnection();

setTimeout(() => pressButton(NodeID_boolSmallCoffee), 1500);

setTimeout(() => ClientDisconnect(), 45000);