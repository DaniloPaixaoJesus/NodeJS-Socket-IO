module.exports = function(io) {

  var crypto = require('crypto')
    , sockets = io.sockets;

  var redis = require('redis').createClient(15400, 'pub-redis-15400.us-east-1-2.3.ec2.garantiadata.com', {no_ready_check: true});
  redis.auth('88878685', function (err) {
      if (err){
        console.log('Error connect database REDIS: '+ err);
      }else{
        console.log('REDIS connected');
      }
  });

  redis.on('connect', function() {
      console.log('Connected to Redis');
  });

  sockets.on('connection', function (client) {

    var session = client.handshake.session
      , usuario = session.usuario;

    client.set('email', usuario.email);

    var onlines = sockets.clients();
    onlines.forEach(function(online) {
      var online = sockets.sockets[online.id];
      online.get('email', function(err, email) {
        client.emit('notify-onlines', email);
        client.broadcast.emit('notify-onlines', email);
      });
    });
  
    client.on('join', function(sala) {

      console.log('  ------>>> BEFORE --->>> join method called  ------>>>'+sala+'<<<-----');

      //Whom enter in the chat will create the chat ROOM with your onw email
      //and people'll send messages to email address's room
      if(sala){
        sala = sala.replace('?','');
        console.log('  ------>>> if(sala){<<<-----');
      } else {
        var timestamp = new Date().toString();
        var md5 = crypto.createHash('md5');
        sala = md5.update(timestamp).digest('hex');
      }
      client.set('sala', sala);
      client.join(sala);

      console.log('  ------>>> AFTER --->>> join method called  ------>>>'+sala+'<<<-----');

      var msg = "<b>"+usuario.nome+":</b> entrou.<br>";
      
      redis.lpush(sala, msg, 
          function(erro, res) {
            redis.lrange(sala, 0, -1, 
                function(erro, msgs) {
                  msgs.forEach(
                    function(msg) {
                      sockets.in(sala).emit('send-client', msg);
                  });
                });
          });

    });

    client.on('send-server', function (msg) {
      var msg = "<b>"+ usuario.nome +":</b> "+ msg +"<br>";
      client.get('sala', function(erro, sala) {

        redis.lpush(sala, msg);

        var data = {email: usuario.email, sala: sala};
        
        //Everybody that has your email in the contact's list
        //will become "MESSAGE" icon
        client.broadcast.emit('new-message', data);
        
        //who send message send only to one room
        sockets.in(sala).emit('send-client', msg);
      });
    });

    client.on('disconnect', function() {
      client.get('sala', function(erro, sala) {
        var msg = "<b>"+ usuario.nome +":</b> saiu.<br>";

        redis.lpush(sala, msg);
        
        client.broadcast.emit('notify-offline', usuario.email);
        sockets.in(sala).emit('send-client', msg);
        client.leave(sala);
      });
    });
  });
};