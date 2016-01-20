module.exports = function(io){

  var sockets = io.sockets;

  // We're connected to someone now. Let's listen for events from them
  var socketCallBack = function (client) { 
            
            //get data from session
            var session = client.handshake.session;
  					var usuario = session.usuario;
  					
  					//listen to someone who send some message
  					//socket.emit('send-to-server', {nome: nome, msg: msg});
  					client.on('send-to-server', function (msg /*data*/) { 
  						var msg = "<b>"+usuario.nome+":</b> " + msg /*data.msg*/ + "<br>";
  
  						//now return to client (whom sent)
  						client.emit('send-client', msg);
  						client.broadcast.emit('send-client', msg);
  					});
  			  };
  
  //socket.io setup
  // Now let's set up and start listening for events
  sockets.on('connection', socketCallBack );

}
