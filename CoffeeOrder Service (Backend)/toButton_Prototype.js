// The function pressButton is used within the toButton Method to "Press the Buttons" in Codesys. It takes the NodeID (in the Codesys OCP UA Namespace) of the button that is to be pressed .
function pressButton(buttonToPressNodeID, callback) {
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
			// return callback(err);
        }
        console.log("Client: Write Response Status Code: ", statusCode.name);
        if (statusCode == opcua.StatusCodes.Good) { // "if the button was pressed successfully"
            nodeToWrite.value.value.value = false;    // We need to set the Button Status  to false in order to "un-press" the button. This is done 500ms after the first write has returned a 'Good' Status Code
            setTimeout(() => client_session.write(nodeToWrite, function (err, statusCode2) {
                if (err) {
                    console.log("Client: Write Reset Error: ", err);
					// return callback(err);
                }
                callback();
                // console.log("Client Debug: Write Reset Response Status Code: ", statusCode2.name);
            }), 500);   // Timer for the Reset, should be ~ 500 [ms]
            // console.log("Client Debug: Write Status Code Good");
        }
        else {
            console.log("Bad Status Code: ", statusCode.name);
            callback();     // callback
		}
    });
}

async function setCoffeeStrength(callback) {
    var difference = valueCoffeeStrength - codesys_coffeeStrength;
    if (codesys_coffeeStrength > valueCoffeeStrength) {	// correction in case the current coffee strength is higher than the desired coffee strength 
        difference += 5;
    }
    console.log("Debug: Desired Coffeestrength: ", valueCoffeeStrength);
    console.log("Debug: Current Coffeestrength: ", codesys_coffeeStrength);
    console.log("Debug: Button will be pressed ", difference, " times.");
    async.whilst(	// documentation of async.whilst:	https://caolan.github.io/async/docs.html#whilst
        function () { return difference > 0 },	    // test: this is the test for the whilst function: call the next function as long as "difference is not null"
        function (cb) {                             // iteratee:
            pressButton(NodeID_boolCoffeeStrength, null);
            difference--;
            setTimeout(cb, 1000);
        },
        function (err) {
            callback(err);                          // callback: "global" callback (callback of setCoffeeStrength) is only calles once the test does not pass anymore, i.e. once difference = 0 (which means the coffeestrength has been set to the correct value)
        }
    );
}

async function makeCoffee(callMethodResult, callback) {
    var ordered;
    function setOrdered(){ ordered = true; console.log("DEBUG: Ordered set to true!"); }    // helper function, passed as callback to pressButton in order to confirm that coffee has been ordered.
    ordered = false;
    async.whilst(
        function () { return ordered },     
        function (cb2) {

            //	*************************************
            //	*		Wrapper Function Logic:		*
            //	*	Decide which coffee to produce	*
            //	*									*
            //	*************************************
            //	Concept:
            //
            //	Cappuccino: more or equal Milk than Coffee
            //	Large: valueCoffeeQuantity more than 200
            //	Medium: valueCoffeeQuantity less than 200 but more than 100
            //	Small: valueCoffeeQuantity less than 100
            //

            if (valueMilkQuantity >= valueCoffeeQuantity) {
                // make Cappuccino
                pressButton(NodeID_boolCappuccino, setOrdered);
                callMethodResult.statusCode = opcua.StatusCodes.Good;
                callMethodResult.outputArguments.value = "Bestellung ausgelöst: Ein Cappuccino der Stärke " + codesys_coffeeStrength + " wurde für Sie bestellt.";
                console.log("Bestellung ausgelöst: Ein Cappuccino der Stärke ", codesys_coffeeStrength, " wurde bestellt.");
            }
            else {
                if (valueCoffeeQuantity > 200) {
                    // make large Coffee
                    pressButton(NodeID_boolLargeCoffee, setOrdered);
                    callMethodResult.statusCode = opcua.StatusCodes.Good;
                    callMethodResult.outputArguments.value = "Bestellung ausgelöst: Ein großer Kaffee wurde für Sie bestellt.";
                    console.log("Bestellung ausgelöst: Ein großer Kaffee der Stärke ", codesys_coffeeStrength, " wurde bestellt.");
                }
                else {
                    if (valueCoffeeQuantity > 100) {
                        // make medium Coffee
                        pressButton(NodeID_boolMediumCoffee, setOrdered);
                        callMethodResult.statusCode = opcua.StatusCodes.Good;
                        callMethodResult.outputArguments.value = "Bestellung ausgelöst: Ein mittlerer Kaffee der Stärke ", codesys_coffeeStrength, " wurde für Sie bestellt.";
                        console.log("Bestellung ausgelöst: Ein mittlerer Kaffee der Stärke ", codesys_coffeeStrength, " wurde bestellt.");
                    }
                    else {
                        // make small Coffee
                        pressButton(NodeID_boolSmallCoffee, setOrdered);
                        callMethodResult.statusCode = opcua.StatusCodes.Good;
                        callMethodResult.outputArguments.value = "Bestellung ausgelöst: Ein kleiner Kaffee der Stärke ", codesys_coffeeStrength, " wurde für Sie bestellt.";
                        console.log("Bestellung ausgelöst: Ein kleiner Kaffee der Stärke ", codesys_coffeeStrength, " wurde bestellt.");
                    }
                }
            }
            cb2();
        },
        function (err) {
            callback();
        }
    );
}


toButtonMethod.bindMethod(function (inputArguments, context, callback) {	// ToDo: Here we add functional logic to the created method shell.

			if (cooldown == true) {
				ResultMessage = "Method on cooldown";	// Todo debug uncomment line below instead
				// ResultMessage = "Es wird gerade ein Kaffee zubereitet, bitte warten Sie einen Moment.";
				callMethodResult.outputArguments.value = ResultMessage;
				callback(null, callMethodResult);
			}
			else {
				if (codesys_intPackMLStatus != 0) {
					ResultMessage = "Fehler: die Kaffeemaschine ist gerade nicht betriebsbereit!";
					callMethodResult.outputArguments.value = ResultMessage;
					callback(null, callMethodResult);
				}
				else {	// Method currently not on cooldown and Coffee Machine is in IDLE Mode
					if (!client_session) {	// checks if the session is null
						ResultMessage = "Fehler: keine Session beim Codesys Server!";
						callMethodResult.outputArguments.value = ResultMessage;
						callback(null, callMethodResult);
					}
					else {	// at this point cooldown, session and packML state have been validated. Coffee can now be produced safely!

						cooldown = true;	// Flag Method for Cooldown
						setTimeout(() => resetCooldown(), (cooldowntime * 1000));	// reset cooldown after (cooldowntime) seconds

						async.series([	// using async.series to ensure these steps are executed in the correct order.
                        
                            // First we need to set the correct coffe strength
                        setCoffeeStrength(),

                        // now we are ready to produce the coffee
                        makeCoffee(callMethodResult, null), // callMethodResult is passed to the function so that the results can be written depending on which coffee has been produced.
							function (err) {
								
							}
                        ]);
						console.log("Debug: async.whilst completed");
					}
				}
			}
		});