
process.env.NODE_ENV = 'production';

var instance_start = require('./server/instance_start');


var socket = function(id) {
	this.id = id;
};

socket.prototype = {
	emit: function(type, data) {
		console.log(this.id + ': ' + type + ' ---> ' + JSON.stringify(data));
	},
	on: function() {
	}
};


var _serversocket = new socket('SERVER');
var _clientsocket = new socket('CLIENT');


var data = {};


instance_start(data, _serversocket);

