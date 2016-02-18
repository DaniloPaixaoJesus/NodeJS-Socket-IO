
/**
import app to raise a server
*/
var app = require('../app');

/**
https://www.npmjs.com/package/should
test framework agnostic BDD-style assertions
*/
var should = require('should');

/**
https://www.npmjs.com/package/supertest 
provide a high-level abstraction for testing HTTP
*/
var request = require('supertest')(app); 


describe('No controller home', 
	function() {
		it('deve retornar status 200 ao fazer GET /', 
				function(done){
					request.get('/').end(
								function(err, res){
										res.status.should.eql(200);
										done();
								});
				}
		);

		it('deve ir para rota / ao fazer GET /sair', 
				function(done){
					request.get('/sair').end(
							function(err, res){
								res.headers.location.should.eql('/');
								done();
							}
					);
				}
		);

		it('deve ir para rota /contatos ao fazer POST /entrar', 
			function(done){
				var login = {usuario: {nome: 'danilo', email: 'danilo@danilo.com'}};
				request.post('/entrar')
				.send(login)
				.end(
					function(err, res){
						res.headers.location.should.eql('/contatos');
						done();
					}
				);
			}
		);

		/*it('deve ir para rota / ao fazer POST /entrar', 
			function(done){
				var login = {usuario: {nome: '', email: ''}};
				request.post('/entrar')
				.send(login)
				.end(
					function(err, res){
						res.headers.location.should.eql('/');
						done();
					}
				);
			}
		);*/

}); // fim da função describe()
