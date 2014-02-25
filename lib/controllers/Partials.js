'use strict';
var path = require('path');
(function () {
  var Partials = function (config) {
    this._config = config;
  };

  Partials.prototype.get = function (req, res) {
    var stripped = req.url.split('/partials/')[1];
    var viewData = {
      req: req
    };
    res.render('partials/' + stripped, viewData, function (err, html) {
      if (err) {
        console.log('Error rendering partial' + stripped + '\n', err);
        res.status(404);
        res.send(404);
      } else {
        res.send(html);
      }
    });
  };

  module.exports = Partials;
})();