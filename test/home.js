var app = require('../app')
  , should = require('should')
  , request = require('supertest')(app);

describe('CONTROLLER HOME', function() {

  this.timeout(5000);

  it('should return status 200 after request GET /', function(done){
    request.get('/')
           .end(function(err, res){
      res.status.should.eql(200);
      done();
    });
  });

  it('should go to route / after request GET /sair', function(done){
    request.get('/sair')
           .end(function(err, res){
      res.headers.location.should.eql('/');
      done();
    });
  });
  
  it('should go to route / after request POST /entrar - empty user', function(done){
    var loginVazio = {usuario: {nome: '', email: ''}};
    request.post('/entrar')
           .send(loginVazio)
           .end(function(err, res){
      res.headers.location.should.eql('/');
      done();
    });
  });

  it('should go to route /contatos after request POST /entrar - valid user', function(done){
    var login = {usuario: {nome: 'Teste', email: 'teste@teste'}};
    request.post('/entrar')
           .send(login)
           .end(function(err, res){
      res.headers.location.should.eql('/contatos');
      done();
    });
  });
});