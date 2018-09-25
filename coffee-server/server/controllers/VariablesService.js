'use strict';

exports.readVariableValue = function(args, res, next) {
  /**
   * parameters expected in the args:
  * nodeId (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "valid" : true,
  "nodeId" : "aeiou",
  "value" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.readVariableValueForAttributeId = function(args, res, next) {
  /**
   * parameters expected in the args:
  * nodeId (String)
  * attributeId (Integer)
  **/
    var examples = {};
  examples['application/json'] = {
  "valid" : true,
  "nodeId" : "aeiou",
  "value" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.writeVariableValue = function(args, res, next) {
  /**
   * parameters expected in the args:
  * nodeId (String)
  * attributeId (Integer)
  * body (WriteValueOptions)
  **/
    var examples = {};
  examples['application/json'] = {
  "valid" : true,
  "nodeId" : "aeiou",
  "value" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

