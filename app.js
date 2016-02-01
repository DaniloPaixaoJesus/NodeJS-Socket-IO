var express = require('express')
, load = require('express-load')
, app = express()
, error = require('./middleware/error')
, server = require('http').createServer(app)
, io = require('socket.io').listen(server)
, mongoose = require('mongoose');

global.db = mongoose.connect('mongodb://danilopaixao:88878685@ds057254.mongolab.com:57254/socket_io_chat');

/**  MongoDB connection **/
//var connstr = 'mongodb://danilopaixao:88878685@ds057254.mongolab.com:57254/socket_io_chat';
//var connstr = 'mongodb://localhost/aulaCrud';

/*mongoose.connect(connstr, function(err){
	if(err) console.log('Error connect database: '+ err);
	console.log('DataBase connected');
});*/

//code for share session ID between socket.io and express
const KEY = 'ntalk.sid', SECRET = 'ntalk';
var cookie = express.cookieParser(SECRET)
, store = new express.session.MemoryStore()
, sessOpts = {secret: SECRET, key: KEY, store: store}
, session = express.session(sessOpts);

//stack of configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//add middleware to  control cookies
//app.use(express.cookieParser('ntalk'));
app.use(cookie);

//add middleware to  control session
//app.use(express.session());
app.use(session);
	
//add middleware responsable for create objects JSON from form HTML
app.use(express.json());
app.use(express.urlencoded());

//add middleware to override method in http form
app.use(express.methodOverride());

//add middleware to manage application's routes allows implement all page erros
app.use(app.router);

//set static files to access http://localhost:3000/css/style.css
app.use(express.static(__dirname + '/public'));

//load middleware page error
app.use(error.notFound);
app.use(error.serverError);

/*
app.use(function(req, res, next) {
	res.status(404);
	res.render('not-found');
});

app.use(function(error, req, res, next) {
	res.status(500);
	res.render('server-error', error);
});
*/

//io authorization log in chat

io.set('authorization', 
	function(data, accept){
	cookie(data, 
		   {}, 
		   function(err){
				//compare sessionID of the server and cookies for authorizate
				var sessionID = data.signedCookies[KEY];
				store.get(sessionID, function(err, session){
							if(err || !session){
								accept(null, false);
							}else{
								data.session = session;
								accept(null, true);
							}
						}
				);
			}
		);
	}
);
	
//Autoload modules into an Express application instance //require('express-load')
//load mvc layers
load('models')
.then('controllers')
.then('routes')
.into(app);

//load socket middleware
load('sockets')
.into(io);
/*
Old socket call
// We're connected to someone now. Let's listen for events from them
var funcSocket = function (client) { 
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
io.sockets.on('connection', funcSocket );
*/

//start server
/*app.listen(3000, function(){
	console.log("NodeJS-Socket-IO is running ...");
});*/

var port = process.env.PORT || 3000;

server.listen(port, function(){
	console.log("NodeJS-Socket-IO is running ...");
});
