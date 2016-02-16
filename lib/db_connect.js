module.exports = function() {
	var mongoose = require('mongoose');
	var env_url = { //'test': 'mongodb://danilopaixao:88878685@ds061415.mongolab.com:61415/apptanamaodb-test'
		'test': 'mongodb://danilopaixao:88878685@ds057254.mongolab.com:57254/apptanamaodb'
		, 'development': 'mongodb://danilopaixao:88878685@ds057254.mongolab.com:57254/apptanamaodb'
		, 'production': 'mongodb://danilopaixao:88878685@ds057254.mongolab.com:57254/apptanamaodb'
	};
	
	//process.env. access environment variable
	var url = env_url[process.env.NODE_ENV || 'development'];
	//return mongoose.connect('mongodb://danilopaixao:88878685@ds057254.mongolab.com:57254/apptanamaodb');
	return mongoose.connect(url);
};