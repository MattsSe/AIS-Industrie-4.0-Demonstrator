'use strict';

var url = require('url');


var Variables = require('../ts.controllers/VariablesService');


module.exports.readVariableValue = function readVariableValue (req, res, next) {
  Variables.readVariableValue(req.swagger.params, res, next);
};

module.exports.readVariableValueForAttributeId = function readVariableValueForAttributeId (req, res, next) {
  Variables.readVariableValueForAttributeId(req.swagger.params, res, next);
};

module.exports.writeVariableValue = function writeVariableValue (req, res, next) {
  Variables.writeVariableValue(req.swagger.params, res, next);
};
