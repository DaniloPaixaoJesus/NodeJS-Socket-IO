module.exports = function(io){

  var sockets = io.sockets;

  // We're connected to someone now. Let's listen for events from them
  var socketCallBack = function (client) { 
  					//listen to someone who send some message
  					//socket.emit('send-to-server', {nome: nome, msg: msg});
  					client.on('send-to-server', function (data) { 
  						var msg = "<b>"+data.nome+":</b> "+data.msg+"<br>";
  
  						//now return to client (whom sent)
  						client.emit('send-client', msg);
  						client.broadcast.emit('send-client', msg);
  					});
  			  };
  
  //socket.io setup
  // Now let's set up and start listening for events
  sockets.on('connection', socketCallBack );

}
