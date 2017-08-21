'use strict';

var url = require('url');


var Server = require('../ts.controllers/ServerService');


module.exports.clearMonitoredItem = function clearMonitoredItem (req, res, next) {
  Server.clearMonitoredItem(req.swagger.params, res, next);
};

module.exports.clearMonitoredItems = function clearMonitoredItems (req, res, next) {
  Server.clearMonitoredItems(req.swagger.params, res, next);
};

module.exports.connectServer = function connectServer (req, res, next) {
  Server.connectServer(req.swagger.params, res, next);
};

module.exports.getBrowseInfo = function getBrowseInfo (req, res, next) {
  Server.getBrowseInfo(req.swagger.params, res, next);
};

module.exports.getMonitoredItem = function getMonitoredItem (req, res, next) {
  Server.getMonitoredItem(req.swagger.params, res, next);
};

module.exports.getMonitoredItems = function getMonitoredItems (req, res, next) {
  Server.getMonitoredItems(req.swagger.params, res, next);
};

module.exports.getServerConnectionState = function getServerConnectionState (req, res, next) {
  Server.getServerConnectionState(req.swagger.params, res, next);
};

module.exports.monitorItem = function monitorItem (req, res, next) {
  Server.monitorItem(req.swagger.params, res, next);
};

module.exports.readVariableValue = function readVariableValue (req, res, next) {
  Server.readVariableValue(req.swagger.params, res, next);
};

module.exports.writeVariableValue = function writeVariableValue (req, res, next) {
  Server.writeVariableValue(req.swagger.params, res, next);
};
