'use strict';
var simpleRecaptcha = require('simple-recaptcha');
(function() {
  var Home = function(config) {
    this._config = config;
  };

  Home.prototype.index = function(req, res) {
    req.session.valid = false;
    res.render('home/index');
  };

  Home.prototype.terminal = function(req, res) {
    res.render('home/emulator');
  };


  Home.prototype.checkRecaptcha = function(req, res) {
    var privateKey = req.config.recaptcha.privateKey;
    var challenge = req.body.challenge;
    var response = req.body.response;
    var ip = req.ip;
    simpleRecaptcha(privateKey, ip, challenge, response, function(err) {
      if (err) {
        return res.send({
          success: false,
          err: err.message
        });
      }
      req.session.valid = true;
      return res.send({
        success: true
      });
    });
  };

  module.exports = Home;
})();