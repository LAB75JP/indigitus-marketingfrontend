'use strict';

var index = require('./controllers');



/**
 * Application routes
 */
module.exports = function (app) {

  var rLib = require('./helpers/RouterLib');
  var Partials = rLib.initController('Partials');

  app.get('/partials/*', Partials.get);

  app.all(rLib.dr(), rLib.routeActions('Home'));

};
