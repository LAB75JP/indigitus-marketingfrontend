'use strict';
var simpleRecaptcha = require('simple-recaptcha');
(function () {
  var Home = function (config) {
    this._config = config;
  };

  Home.prototype.index = function (req, res) {
    res.render('home/index');
  };

  Home.prototype.terminal = function (req, res) {
    res.render('home/emulator');
  };
  
  Home.prototype.recaptcha = function (req, res) {
    var viewData = {
      publicKey: req.config.recaptcha.publicKey
    };
    res.render('home/recaptcha', viewData);
  };

  Home.prototype.checkRecaptcha = function (req, res) {
    var privateKey = req.config.recaptcha.privateKey;
    var challenge = req.body.recaptcha_challenge_field;
    var response = req.body.recaptcha_response_field;
    var ip = req.ip;
    simpleRecaptcha(privateKey, ip, challenge, response, function (err) {
      if (err) {
        return res.send(err);
      }
      return res.send('valid');
    });
  };

  module.exports = Home;
})();