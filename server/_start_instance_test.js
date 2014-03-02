
var getTemplateServer = function(servers){
  for(var i=0; i < servers.length; i++){
    if(servers[i].name==='marketing_template'){
      return servers[i];
    }
  }
  return null;
};

var Nova = require('openclient').Nova;

var client = new Nova({
  url: 'http://identity-pub.stage.indigitus.net/v2.0',
  debug: true
})

client.authenticate({
    username: 'marco@lab75.jp',
    password: 'lab75',
    project:'00000000marco@lab75.jp'
  // Callbacks can either be success/error handlers in the options object or
  // a callback function as the last argument.
  }, function (err, token) {
    console.log(err);
    console.log(token);
    
    client.servers.all({
      endpoint_type: "adminURL",  // Defaults to "publicURL".

      // Callbacks receive the result of the call;
      success: function (servers) {
        console.log('SERVERS');
        console.log(JSON.stringify(servers, null, '\t'));
        
        var templateServer = getTemplateServer(servers);
        if(!templateServer) return;
        
        var floating_ips = client.floating_ips.all({
          success: function(floating_ips){
            console.log('FLOATING IPS');
            console.log(floating_ips);
          }
        });
        var serverData = {
          name: 'marketing_server_' + servers.length,
          imageRef: templateServer.image.links[0].href,
          flavorRef: templateServer.flavor.links[0].href,
          networks: [{
            uuid: 'a7a76164-ef12-4adb-96c0-b703e71f7355'
          }],
          key_name: 'marketing_key'
        };
        console.log('SERVER DATA', serverData);
        return;
        var newServer = client.servers.create({
          data: serverData,
          async: false
        });
        console.log(newServer);
        
      },
      error: function (err) {
        console.error(err);
      }
    });
    
    
  });