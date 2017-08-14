#!/usr/bin/env node

/**
 * Module dependencies.
 */

"use strict";

//module dependencies
const server = require("./server");
const uaIO = require("./ua.socket");
const debug = require("debug")("plant-ais:serve");
const http = require("http");

//create http server
const httpPort = normalizePort(process.env.PORT || 3000);
const app = server.Server.create().app;
app.set("port", httpPort);

const httpServer = http.createServer(app);

// Socket.io for real time communication
const uaSocket = uaIO.UASocket.create(httpServer);

//listen on provided ports
httpServer.listen(httpPort);

//add error handler
httpServer.on("error", onError);

//start listening on port
httpServer.on("listening", onListening);


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof httpPort === "string"
    ? "Pipe " + httpPort
    : "Port " + httpPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}

// io.sockets.on('connection', function (socket) {
//   console.log('Socket connected');
//   // Socket event for gist created
//   socket.on('gistSaved', function (gistSaved) {
//     io.emit('gistSaved', gistSaved);
//     console.log('gistsave called on server');
//   });
//   io.emit("clientConnected", "msg from server");
//
//   // Socket event for gist updated
//   socket.on('gistUpdated', function(gistUpdated){
//     io.emit('gistUpdated', gistUpdated);
//   });
//
// });
