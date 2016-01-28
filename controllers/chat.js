module.exports = function(app) {
	var ChatController = {
		index: function(req, res){
			/*var resultado = {email: req.params.email,
					usuario: req.session.usuario
				
			};*/
			var param = {email:req.params.email};
			//var param = {sala: req.query.sala}; //na versao 4
			res.render('chat/index', param /*resultado*/);
		}
	};
	return ChatController;
};
