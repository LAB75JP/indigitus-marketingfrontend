'use strict';

var api = require('./controllers/api'),
  index = require('./controllers');



/**
 * Application routes
 */
module.exports = function (app) {

  var rLib = require('./helpers/RouterLib');
  var Partials = rLib.initController('Partials');
  console.log('PARTIALS');
  console.log(Partials);

  app.get('/partials/*', Partials.get);
  app.get('/partials/*', function (req, res) {
    res.send('PARTIALS');
  });
  app.all(rLib.dr(), rLib.routeActions('Home'));

};