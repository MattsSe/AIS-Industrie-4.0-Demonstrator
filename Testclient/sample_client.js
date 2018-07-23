/*global require,console,setTimeout */
var opcua = require("node-opcua");
var async = require("async");

var client = new opcua.OPCUAClient();
// var endpointUrl = "opc.tcp://" + require("os").hostname() + ":34197/UA/Testserver";
var endpointUrl = "opc.tcp://raspberrypi:34197/CoffeeOrder_STUD";

var the_session, the_subscription;

const userInfo = {userName: "Anna", password: "123456"}

async.series([

    // step 1 : connect to
    function(callback)  {
        client.connect(endpointUrl,function (err) {
            if(err) {
                console.log(" cannot connect to endpoint :" , endpointUrl );
            } else {
                console.log("connected !");
				console.log("success of step 1");
            }
            callback(err);
        });
    },

    // step 2 : createSession
    function(callback) {
        client.createSession(userInfo, function(err,session) { // creates a new Session with the "anonymous" Role
            if(!err) {
                the_session = session;
				console.log("success of step 2");
            }
            callback(err);
        });
    },

    // step 3 : browse
    function(callback) {
       the_session.browse("RootFolder", function(err,browseResult){
           if(!err) {
               browseResult.references.forEach(function(reference) {
                   console.log( reference.browseName.toString());
               });
			   console.log("success of step 3");
           }
           callback(err);
       });
    },

    // step 4 : read a variable with readVariableValue
    function(callback) {
       the_session.readVariableValue("ns=1;s=free_memory", function(err,dataValue) {
           if (!err) {
               console.log(" free mem % = " , dataValue.toString());
			   console.log("success of step 4");
           }
           callback(err);
       });
       
       
    },
    
    // step 4' : read a variable with read
    function(callback) {
       var maxAge = 0;
       var nodeToRead = { 
			nodeId: "ns=1;s=free_memory",
			attributeId: opcua.AttributeIds.Value
			};
       the_session.read(nodeToRead, maxAge, function(err,dataValue) {
           if (!err) {
               console.log(" free mem % = " , dataValue.toString() );
			   console.log("success of step 4.2");
           }
           callback(err);
       });
       
       
    },
    
    // step 5: install a subscription and install a monitored item for 10 seconds
	
	/*
	Dieser Block ist besonders für das Beobachten der Maschinendaten interessant.
	Das Frontend kann die Maschinendaten subscriben und bekommt dann nur Änderungen der Daten über ein gewisses Intervall hinaus mit.
	Vielleicht bekomme ich es hin, dass der AA-Client direkt beim COdesys Server auf die dortige Variable subscribed ist.
	*/
    function(callback) {
       
       the_subscription=new opcua.ClientSubscription(the_session,{
           requestedPublishingInterval: 1000,
           requestedLifetimeCount: 20,
           requestedMaxKeepAliveCount: 2,
           maxNotificationsPerPublish: 10,
           publishingEnabled: true,
           priority: 10
       });
       
       the_subscription.on("started",function(){
           console.log("subscription started for 2 seconds - subscriptionId=",the_subscription.subscriptionId);
       }).on("keepalive",function(dataValue){
           console.log("keepalive");
       }).on("terminated",function(){
		   console.log("terminated");
       });
       
       setTimeout(function(){
           the_subscription.terminate(callback);
       },15000); /*Nach Ablauf dieses Timers (in ms) wird die Subscription beendet.*/
       
       // install monitored item
       var monitoredItem  = the_subscription.monitor({
           nodeId: opcua.resolveNodeId("ns=1;b=1020FAFA"), /*Die NodeID habe ich einfach "erfunden", ich habe die NodeID von "MyVariable2" im Sample_Server.js in Testserver kopiert und leicht verändert!*/
           attributeId: opcua.AttributeIds.Value
       },
       {
           samplingInterval: 50, /* "Abtastrate" in ms mit der der Wert des subscribed Attribute gelesen wird.*/
           discardOldest: true,
           queueSize: 5 /*Bestimmt, wie groß die Queue (die Liste mit "gemerkten" Werten) ist.*/
       },
       opcua.read_service.TimestampsToReturn.Both
       );
       console.log("-------------------------------------");
       
       monitoredItem.on("changed",function(dataValue){
          console.log(" Der Wert von MyVariable1 auf dem Server ist: ",dataValue.value.value);
       });
    },

    // close session
    function(callback) {
        the_session.close(function(err){
            if(err) {
                console.log("session closed failed ?");
            }
            callback();
        });
    }

],
function(err) {
    if (err) {
        console.log(" failure ",err);
    } else {
        console.log("done!");
    }
    client.disconnect(function(){});
}) ;
