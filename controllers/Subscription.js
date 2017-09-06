'use strict';

var url = require('url');


var Subscription = require('../ts.controllers/SubscriptionService');


module.exports.clearMonitoredItems = function clearMonitoredItems (req, res, next) {
  Subscription.clearMonitoredItems(req.swagger.params, res, next);
};

module.exports.clearMonitoredItemsForNodeId = function clearMonitoredItemsForNodeId (req, res, next) {
  Subscription.clearMonitoredItemsForNodeId(req.swagger.params, res, next);
};

module.exports.getAllMonitoredItems = function getAllMonitoredItems (req, res, next) {
  Subscription.getAllMonitoredItems(req.swagger.params, res, next);
};

module.exports.getMonitoredItem = function getMonitoredItem (req, res, next) {
  Subscription.getMonitoredItem(req.swagger.params, res, next);
};

module.exports.getMonitoredItemsForNodeId = function getMonitoredItemsForNodeId (req, res, next) {
  Subscription.getMonitoredItemsForNodeId(req.swagger.params, res, next);
};

module.exports.monitorItem = function monitorItem (req, res, next) {
  Subscription.monitorItem(req.swagger.params, res, next);
};

module.exports.unmonitorItem = function unmonitorItem (req, res, next) {
  Subscription.unmonitorItem(req.swagger.params, res, next);
};
