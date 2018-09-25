'use strict';

var url = require('url');


var Connector = require('../ts.controllers/ConnectorService');


module.exports.closeServerConnection = function closeServerConnection (req, res, next) {
  Connector.closeServerConnection(req.swagger.params, res, next);
};

module.exports.connectServer = function connectServer (req, res, next) {
  Connector.connectServer(req.swagger.params, res, next);
};

module.exports.getServerConnectionState = function getServerConnectionState (req, res, next) {
  Connector.getServerConnectionState(req.swagger.params, res, next);
};
