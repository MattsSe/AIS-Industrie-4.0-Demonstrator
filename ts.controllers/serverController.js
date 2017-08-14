"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerController = (function () {
    function ServerController() {
    }
    ServerController.prototype.clearMonitoredItem = function (eq, res, next) {
    };
    ServerController.prototype.clearMonitoredItems = function (req, res, next) {
        /**
         * parameters expected in the args:
         * limit (Integer)
         **/
        // no response value expected for this operation
        res.end();
    };
    ServerController.prototype.getBrowseInfo = function (req, res, next) {
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
    ServerController.prototype.getMonitoredItem = function (req, res, next) {
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
    ServerController.prototype.getMonitoredItems = function (req, res, next) {
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
    ServerController.prototype.monitorItem = function (req, res, next) {
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
    ServerController.prototype.readVariableValue = function (req, res, next) {
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
    ServerController.prototype.serverGET = function (req, res, next) {
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
    ServerController.prototype.serverUrlGET = function (req, res, next) {
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
    ServerController.prototype.serverUrlPOST = function (req, res, next) {
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
    ServerController.prototype.writeVariableValue = function (req, res, next) {
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
