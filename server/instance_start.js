
/*
 * HELPERS
 */

var _Nova   = require('openclient').Nova;
var _CONFIG = require('../lib/config/config');
var async = require('async');

/*
 * IMPLEMENTATION
 */

(function(global) {
	
	console.log('CONFIG', _CONFIG);
	
	var _server = null;
	var _client = new _Nova({
		url:           _CONFIG.nova,
		debug:         true,
		enforce_https: false
	});



	/*
	 * CHAINED REST API CALLS
	 */

	var _authenticate = function(success, error, scope) {

		_client.authenticate({
			username: _CONFIG.username,
			password: _CONFIG.password,
			project:  _CONFIG.project,

			success: function(tokens) {
				success.call(scope, tokens);
			},
			error: function(err) {
				error.call(scope, err);
			}
		});

	};

	var _clone_template = function(success, error, scope) {

		_client.servers.all({

			endpoint_type: 'publicURL',

			success: function(servers) {

				console.log('CONFIG', _CONFIG);
				console.log('SERVERS', servers);
				var template = null;
				for (var s = 0, sl = servers.length; s < sl; s++) {
					if (servers[s].name === _CONFIG.template) {
						template = servers[s];
						break;
					}
				}
				
				console.log('TEMPLATE', template.links);


				if (template !== null) {

					var data = {
						name:      _CONFIG.instance + servers.length,
						imageRef:  template.image.links[0].href,
						flavorRef: template.flavor.links[0].href,
						networks:  _CONFIG.networks,
						key_name:  _CONFIG.sshkey || ''
					};

					success.call(scope, data);

				} else {
					error.call(scope, 'Template "' + _CONFIG.template + '" not found.');
				}

			},
			error: function(err) {
				error.call(scope, err);
			}
		})

	};

	var _create_server = function(data, success, error, scope) {

		_client.servers.create({
			endpoint_type: 'publicURL',
			data: data,

			success: function(data) {
				success.call(scope, data);
			},
			error: function(err) {
				error.call(scope, err);
			}
		})

	};

	var _delete_server = function(id) {

		_client.servers.del({
			endpoint_type: 'publicURL',
			id:    id,
			async: false
		});

	};

	var _assign_ip = function(server, success, error, scope) {
		
		_client.floating_ips.all({
			endpoint_type: 'publicURL',
			success: function(data) {
				
				if (data.length > 0) {
					var floatingIp = null
					for(var i = 0; i < data.length; i++){
						if(data[i].instance_id === null){
							floatingIp = data[i];
							break;
						}
					}

					// This timeout was added due to this error:
					// (400) "No nw_info cache associated with instance"
					
					console.log('FLOATING IP', floatingIp);
					if(!floatingIp){
						_delete_server(server.id);
						error.call(scope, 'No available floating IP found');						
					}
					
					_client.servers.add_floating_ip({
						async: true,
						data: {
							id: server.id,
							address: floatingIp.ip
						}
					});
					
					
					success.call(scope, {});
					return;	
					
				} else {
					error.call(scope, 'No Floating IPs available');
				}

			},
			error: function(err) {
				error.call(scope, 'Could not retrieve floating IPs');
			}
		});

	};

	var _get_server = function(server, success, error, scope) {

		_client.servers.get({
			endpoint_type: 'publicURL',
			id: server.id,
			success: function(data) {
				success.call(scope, data);
			},
			error: function(err) {
				error.call(scope, 'Could not get server');
			}
		});

	};
	
	
	var repeat = function(pattern, count) {
		if (count < 1) return '';
		var result = '';
		while (count > 0) {
			if (count & 1) result += pattern;
			count >>= 1, pattern += pattern;
		}
		return result;
	}
	
	var Callback = function(data, socket) {
		
		var _step = function(msg){
			socket.emit('instance.step', {
				line: msg
			});
		};

		var _on_error = function(message) {

			socket.emit('instance.error', {
				line: message
			});

			if (_server !== null) {
				_delete_server(_server.id);
			}

		};
		
		_step('Booting up an Instance just for you...');
		_step('Authenticating...');

		_authenticate(function(tokens) {
			
			_step('Authentication successful.');
			_step('Clonging template ...');

			_clone_template(function(data) {
				
				_step('Creating server instance "' + data.name + '" ...');

				_create_server(data, function(server) {

					_server = server;
					
					_step('Assigning Floating IP to Instance ...');
			
					console.log('ASSIGN IP');
					_assign_ip(server, function(result) {
						console.log('ASSIGNED IP');
						console.log('ASSIGNED IP', result);
						_get_server(server, function(data) {
							
							var publicIp = null;
							var counter = 0;
							var active = false;
							
							_step('Server Starting Up');
							
							var serverInfo = function(){
								_get_server(server, function(data){
									console.log('GET SERVER RESULTED IN', JSON.stringify(data,null, '\t'));
									
									console.log(data.status);
									
									if(!publicIp && data.addresses){
										publicIp = data.addresses[Object.keys(data.addresses)[0]][0].addr;
										_step('Assigned Floating ip: ' + publicIp);
										socket.emit('instance.public_ip', {publicIp: publicIp});
									}
									
									if(data.status === 'ACTIVE'){
										active = true;
										_step('Server Ready!');
										socket.emit('instance.ready');
									}
									if(active){
										return;
									}
									
									if(counter < 10){
										_step('Booting' + repeat('.', counter) );
										setTimeout(serverInfo, 3000);
									}
									else {
										_delete_server(_server.id);
										error.call(scope, 'Could not get Server IP');
									}
									counter++;
								});
							};
							setTimeout(serverInfo, 3000);

						}, _on_error, this);

					}, _on_error, this);;

				}, _on_error, this);

			}, _on_error, this);

		}, _on_error, this);

	};


	module.exports = Callback;

})(this);

