var app = require('../app')
  , request = require('supertest')(app);

describe('CONTROLLER CONTATOS', function() {

  this.timeout(5000);

  describe('USER NO AUTHENTICATED', function() {

    it('should go to route / after request GET /contatos', function(done){
      request.get('/contatos')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('should go to route / after request GET /contato/1', function(done){
      request.get('/contato/1')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('should go to route / after request GET /contato/1/editar', function(done){
      request.get('/contato/1/editar')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('should go to route / after request POST /contato', function(done){
      request.post('/contato')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('should go to route / after request DELETE /contato/1', function(done){
      request.del('/contato/1')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('should go to route / after request PUT /contato/1', function(done){
      request.put('/contato/1')
             .end(function(err, res) {
        res.headers.location.should.eql('/');
        done();
      });
    });

    it('should NOT show list json after request GET /contatos/api/list - user NOT AUTHENTICATED', function(done){
      
      request.get('/contatos/api/list')
      .set('Accept', 'application/json')
      .expect(302)
      .end(function(err, res){
        if (err){ 
          return done(err);
        }
        res.should.be.json;
        done();
      });
    });



  });



describe('USER AUTHENTICATED', function() {

    /* set up data test for execute method post, get, put and delete on the route /contatos */
    var login = {usuario: {nome: 'login_access', email: 'login_access@login_access',}}      
      , cookie;

    //before each test inside 'describe'
    beforeEach(function(done) {
      request.post('/entrar') //call /entrar for log in and create a session
             .send(login)
             .expect(200)
             .end(function(err, res) {
        cookie = res.headers['set-cookie']; //set cookies in the responde to variable 'cookie'
        done();
      });
    });


    it('should return 200 after request GET /contatos - show list', function(done){
      var req = request.get('/contatos');
      //set cookie in the variable to request's cookie
      req.cookies = cookie; // the reason is we neeed keep our session activate

      req.end(function(err, res) {
        res.status.should.eql(200);
        done();
      });
    });

    it('should show list json after request GET /contatos/api/list - show json list user', function(done){
      
      var req = request.get('/contatos/api/list');
      
      req.cookies = cookie; //simulate user authenticated
      req.set('Accept', 'application/json')
      .expect("Content-type",/json/)
      .expect(200)//302 process ok -> found API but not works
      .end(function(err, res){
        if (err){ 
          return done(err);
        }
        res.should.be.json;
        //console.log(res.body);
        
        res.body.should.have.property('_id');
        res.body.should.have.property('nome');        
        res.body.should.have.property('email');
        res.body.nome.should.equal('login_access');
        //res.body.lastName.should.equal('email');                    
        //res.body.creationDate.should.not.equal(null);
        done();
      });
    });
    

    it('should go to route /contatos after request POST /contato - create new one', function(done){
      var req = request.post('/contato');
      var contato = {contato: {nome: 'testuser', email: 'testuser@testuser'}}
      req.cookies = cookie;
      req.send(contato).end(function(err, res) {
        res.headers.location.should.eql('/contatos');
        done();
      });
    });


    it('should go to route /contatos after request PUT /contato/56df6ef6bc95e0201f5bd71d - update 1', function(done){
      var req = request.put('/contato/56df6ef6bc95e0201f5bd71d');
      //update testuser inside login_access
      var contato = {contato: {nome: 'testuser_updated', email: 'testuser_updated@testuser_updated'}}
      req.cookies = cookie;
      req.send(contato).end(function(err, res) {
        res.headers.location.should.eql('/contatos');
        done();
      });
    });
    


  });

  

});