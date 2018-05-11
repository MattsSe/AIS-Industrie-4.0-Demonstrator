/* Copy from https://github.com/node-opcua/node-opcua/blob/master/documentation/server_with_method.js */


/* Zweiter selbst konfigurierter Testserver */

/* global console, require */
var opcua = require("node-opcua");



var server = new opcua.OPCUAServer({
    port: 34197, // the port of the listening socket of the server
    resourcePath: "UA/Testserver2", // this path will be added to the endpoint resource name
	buildInfo : {
        productName: "MeinTestServer2",
        buildNumber: "12345",
        buildDate: new Date(2018,4,24)
    }
});

function post_initialize() {
    console.log("initialized");
    var addressSpace = server.engine.addressSpace;

    var myDevice = addressSpace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "MeineKaffeemaschine"
    });
	// add some variables 
    // add a variable named MyVariable1 to the newly created folder "MeineKaffeemaschine"
    var variable1 = 69;
	
    var method = addressSpace.addMethod(myDevice, {

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
    });

    // optionally, we can adjust userAccessLevel attribute
    //method.outputArguments.userAccessLevel = opcua.makeAccessLevel("CurrentRead");
    //method.inputArguments.userAccessLevel = opcua.makeAccessLevel("CurrentRead");
    

    method.bindMethod(function (inputArguments, context, callback) {

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
    });

}

server.initialize(post_initialize);

server.start(function () {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
	console.log("port ", server.endpoints[0].port);
    var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" the primary server endpoint url is ", endpointUrl );
});