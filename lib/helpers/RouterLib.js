/*global module*/
'use strict';
var config = require('../config/config');
var _ = require('underscore.string');
//var debug = require('debug')('RouterLib');
(function () {
  var RouterLib = function () {
    var that = this;

    that.initController = function (controllerName, dConfig) {
      try {
        var Controller = require('../controllers/' + controllerName);
        console.log('INIT CONTROLLER');
        console.log(Controller);
        var inst = new Controller(config);
        console.log(inst);
        return inst;
      } catch (e) {
        console.log('Controller ' + controllerName + ' does not exist');
      }

    };

    that.r = function () {
      var ar = Array.prototype.slice.call(arguments);
      return '/' + ar.join('/');
    };

    that.dr = function () {
      var ar = Array.prototype.slice.call(arguments);
      ar.push(':p?');
      return '/' + ar.join('/');
    };

    that.routeActions = function (controllerName) {

      var controller = that.initController(controllerName);
      return function (req, res) {
        var action = null;
        var id = null;
        var param = req.param('p');

        if (parseInt(param) > 0 && req.method === 'DELETE') {
          action = 'delete';
          id = parseInt(param);
        }

        if (parseInt(param) > 0 && req.method === 'PUT') {
          action = 'update';
          id = parseInt(param);
        }

        if (!param && req.method === 'POST') {
          action = 'create';
        }

        if (!param && req.method === 'GET') {
          action = 'index';
        }

        if (!action && typeof param === 'string') {
          action = param;
        }
        action = _.camelize(action);

        if (typeof controller[action] === 'function' && action.indexOf('_') !== 0) {
          return controller[action](req, res, id);
        } else {
          return res.send('NOT FOUND');
        }

      };

    };
    return that;
  };
  module.exports = new RouterLib();
})();