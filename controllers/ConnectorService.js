'use strict';

exports.closeServerConnection = function(args, res, next) {
  /**
   * parameters expected in the args:
  **/
    var examples = {};
  examples['application/json'] = {
  "msg" : "aeiou",
  "success" : true
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.connectServer = function(args, res, next) {
  /**
   * parameters expected in the args:
  * body (ServerConnection)
  **/
    var examples = {};
  examples['application/json'] = {
  "msg" : "aeiou",
  "success" : true
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

exports.getServerConnectionState = function(args, res, next) {
  /**
   * parameters expected in the args:
  * url (String)
  **/
    var examples = {};
  examples['application/json'] = {
  "connected" : true,
  "endPointUrl" : "aeiou"
};
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
}

