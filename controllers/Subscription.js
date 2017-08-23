'use strict';

var url = require('url');


var Subscription = require('../ts.controllers/SubscriptionService');


module.exports.clearMonitoredItem = function clearMonitoredItem (req, res, next) {
  Subscription.clearMonitoredItem(req.swagger.params, res, next);
};

module.exports.clearMonitoredItems = function clearMonitoredItems (req, res, next) {
  Subscription.clearMonitoredItems(req.swagger.params, res, next);
};

module.exports.getMonitoredItem = function getMonitoredItem (req, res, next) {
  Subscription.getMonitoredItem(req.swagger.params, res, next);
};

module.exports.getMonitoredItems = function getMonitoredItems (req, res, next) {
  Subscription.getMonitoredItems(req.swagger.params, res, next);
};

module.exports.monitorItem = function monitorItem (req, res, next) {
  Subscription.monitorItem(req.swagger.params, res, next);
};
