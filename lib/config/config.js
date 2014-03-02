'use strict';

var _   = require('lodash');
var all = require('./env/all.js');
var env = require('./env/' + process.env.NODE_ENV + '.js');

var config = _.extend({}, all, env);

module.exports = _.extend(
	{},
	all,
	env
);

