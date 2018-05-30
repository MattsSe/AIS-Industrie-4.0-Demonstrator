/*global require,console,setTimeout */
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();
// var CodesysEndpoint = "opc.tcp://" + require("os").hostname() + ":34197/UA/Testserver";
var CodesysEndpoint = "opc.tcp://JAKOBSDESKTOP:34197/CoffeeOrder";

var client_session;
var client_subscription;

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
  

ClientConnection();
setTimeout(() => ClientDisconnect(), 5000);