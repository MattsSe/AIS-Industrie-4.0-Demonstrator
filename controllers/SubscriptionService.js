'use strict';

exports.clearMonitoredItem = function(args, res, next) {
  /**
   * parameters expected in the args:
  * nodeId (String)
  **/
  // no response value expected for this operation
  res.end();
}

exports.clearMonitoredItems = function(args, res, next) {
  /**
   * parameters expected in the args:
  * limit (Integer)
  **/
  // no response value expected for this operation
  res.end();
}

exports.getMonitoredItem = function(args, res, next) {
  /**
   * parameters expected in the args:
  * nodeId (String)
  **/
    var examples = {};
  examples['application/json'] = { };
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.getMonitoredItems = function(args, res, next) {
  /**
   * parameters expected in the args:
  * limit (Integer)
  **/
    var examples = {};
  examples['application/json'] = "";
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.monitorItem = function(args, res, next) {
  /**
   * parameters expected in the args:
  * nodeId (String)
  * attributeId (Integer)
  **/
    var examples = {};
  examples['application/json'] = { };
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

