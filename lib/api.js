/*
 * Cylon API
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var http = require('http'),
    https = require('https'),
    _ = require('lodash'),
    SocketMaster = require('./socket-master.js');

var API = module.exports = function(opts) {
  if (opts == null) {
    opts = {};
  }

  this.mcp = opts.mcp;

  _.forEach(this.defaults, function(def, name) {
    this[name] = _.has(opts, name) ? opts[name] : def;
  }, this);
};

API.prototype.defaults = {
  name: 'socketio',
  host: '127.0.0.1',
  port: '3000',
  auth: false,
  CORS: '*:*',
  ssl: {},
};

API.prototype.start = function() {
  this.createServer();
  this.listen();
};

API.prototype.createServer = function createServer() {
  if (Object.keys(this.ssl).length===0) {
    this.server = this.http = http.createServer();
  } else {
    this.server = this.http = https.createServer(this.ssl);
  }
    
  this.sm = this._newSM();
};

API.prototype.listen = function() {
  this.server.listen(this.port, function() {
    this.sm.start();
    this.sm.io.set('origins', this.CORS || '*:*');
    console.log('SocketIO server listening at ' + this.host + ':' + this.port);
  }.bind(this));
};

API.prototype._newSM = function() {
  return new SocketMaster(this.http, this.mcp);
};
