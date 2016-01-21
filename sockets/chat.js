/**
*  Module responsible for:
      open websocket connection
      response and requests data
*/
module.exports = function(io){

  //initialize cripto module
  var crypto = require('crypto');
  var md5 = crypto.createHash('md5')

  //start socket io
  var sockets = io.sockets;

  // We're connected to someone now. Let's listen for events from them
  var socketCallBack = function (client) { 
            
            //get data from session
            var session = client.handshake.session;
  					var usuario = session.usuario;

            client.on('join', 
                    function(sala) {
                        if(sala) {
                          sala = sala.replace('?','');
                        } else {
                          var timestamp = new Date().toString();
                          var md5 = crypto.createHash('md5');
                          sala = md5.update(timestamp).digest('hex');
                        }
                        
                        console.log("............SALA...=="+sala+"==");
                        console.log("............usuario.nome...=="+usuario.nome+"==");

                        client.set('sala', sala);
                        client.join(sala);
                    }
            );
  					
            //event send-to-server
  					//listen to someone who send some message
  					//socket.emit('send-to-server', {nome: nome, msg: msg});
  					client.on('send-to-server', 
                    function (msg /*data*/) { 
          						var msg = "<b>"+usuario.nome+":</b> " + msg /*data.msg*/ + "<br>";
          
          						//now return to client (whom sent)
          						//client.emit('send-client', msg);
          						//client.broadcast.emit('send-client', msg);

                      //change code to send message to especific room
                      // get which room the user come from
                      client.get('sala', 
                                function(erro, sala) {
                                    var data = {email: usuario.email, sala: sala};
                                    console.log("............send-to-server.......==");
                                    client.broadcast.emit('new-message', data);
                                    sockets.in(sala).emit('send-client', msg);
                                }
                      );

        					  }
            );



            client.on('disconnect', 
                    function () {
                      client.get('sala', 
                              function(erro, sala) {
                                client.leave(sala);
                              }
                      );
                    }
            );


  			  };
  
  //socket.io setup
  // Now let's set up and start listening for events
  sockets.on('connection', socketCallBack );

}
