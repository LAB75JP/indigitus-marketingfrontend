
'use strict';

var _   = require('lodash');
var _fs = require('fs');

var all = {
	root: require('path').normalize(__dirname + '/../..'),
	port: process.env.PORT || 3000,
	securePort: 9001
};

var variant = process.env.NODE_ENV || 'development';
var env     = JSON.parse(_fs.readFileSync(all.root + '/lib/config/env.json'))[variant] || {};


module.exports = _.extend({}, all, env);

