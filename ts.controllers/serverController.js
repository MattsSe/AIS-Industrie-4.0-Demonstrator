"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility Class to keep swagger gen code and write appropriated services externally in typescript
 */
var ServerController = (function () {
    function ServerController() {
    }
    ServerController.clearMonitoredItem = function (eq, res, next) {
    };
    ServerController.clearMonitoredItems = function (req, res, next) {
        /**
         * parameters expected in the args:
         * limit (Integer)
         **/
        // no response value expected for this operation
        res.end();
    };
    ServerController.getBrowseInfo = function (req, res, next) {
        /**
         * parameters expected in the args:
         * qualifiedName (String)
         **/
        var examples = {};
        examples['application/json'] = {};
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.getMonitoredItem = function (req, res, next) {
        /**
         * parameters expected in the args:
         * nodeId (String)
         **/
        var examples = {};
        examples['application/json'] = [{}];
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.getMonitoredItems = function (req, res, next) {
        /**
         * parameters expected in the args:
         * limit (Integer)
         **/
        var examples = {};
        examples['application/json'] = [{}];
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.monitorItem = function (req, res, next) {
        /**
         * parameters expected in the args:
         * nodeId (String)
         * attributeId (Integer)
         **/
        var examples = {};
        examples['application/json'] = {};
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.readVariableValue = function (req, res, next) {
        /**
         * parameters expected in the args:
         * nodeId (String)
         **/
        var examples = {};
        examples['application/json'] = {
            'valid': true,
            'nodeId': 'aeiou',
            'value': 'aeiou'
        };
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.serverGET = function (req, res, next) {
        /**
         * parameters expected in the args:
         **/
        var examples = {};
        examples['application/json'] = {};
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.serverUrlGET = function (req, res, next) {
        /**
         * parameters expected in the args:
         * url (String)
         **/
        var examples = {};
        examples['application/json'] = {};
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.serverUrlPOST = function (req, res, next) {
        /**
         * parameters expected in the args:
         * url (String)
         **/
        var examples = {};
        examples['application/json'] = {};
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    ServerController.writeVariableValue = function (req, res, next) {
        /**
         * parameters expected in the args:
         * nodeId (String)
         * value (String)
         **/
        var examples = {};
        examples['application/json'] = {
            'valid': true,
            'nodeId': 'aeiou',
            'value': 'aeiou'
        };
        if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        }
        else {
            res.end();
        }
    };
    return ServerController;
}());
exports.ServerController = ServerController;
