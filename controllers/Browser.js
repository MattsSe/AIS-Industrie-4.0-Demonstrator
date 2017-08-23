'use strict';

var url = require('url');


var Browser = require('../ts.controllers/BrowserService');


module.exports.getAllAttributes = function getAllAttributes (req, res, next) {
  Browser.getAllAttributes(req.swagger.params, res, next);
};

module.exports.getBrowseInfo = function getBrowseInfo (req, res, next) {
  Browser.getBrowseInfo(req.swagger.params, res, next);
};

module.exports.getChildren = function getChildren (req, res, next) {
  Browser.getChildren(req.swagger.params, res, next);
};
