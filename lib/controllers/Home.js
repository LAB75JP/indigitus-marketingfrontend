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
    var challenge = req.body.challenge;
    var response = req.body.response;
    var ip = req.ip;
    simpleRecaptcha(privateKey, ip, challenge, response, function (err) {
      if (err) {
        console.log('ERROR OCCURED');
        console.log(err);
        return res.send({
          success: false,
          err: err.message
        });
      }
      return res.send({
        success: true
      });
    });
  };

  module.exports = Home;
})();