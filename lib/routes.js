'use strict';

var api = require('./controllers/api'),
  index = require('./controllers');


/**
 * Application routes
 */
module.exports = function (app) {
  
  var rLib = require('./helpers/RouterLib');
  app.all( rLib.dr(),  rLib.routeActions('Home') );
  
};