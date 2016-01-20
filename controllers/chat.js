module.exports = function(app) {
	var ChatController = {
		index: function(req, res){
			/*var resultado = {email: req.params.email,
					usuario: req.session.usuario
				
			};*/
			var param = {email:req.params.email};
			res.render('chat/index', param /*resultado*/);
		}
	};
	return ChatController;
};
