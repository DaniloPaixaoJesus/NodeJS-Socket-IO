module.exports = function(app) {

  var Schema = require('mongoose').Schema;
  var db = require('../lib/db_connect')();

  var contato = Schema({
    nome: String
  , email: String
  });

  var usuario = Schema({
    nome: {type: String, required: true}
  , email: {type: String, required: true
          , index: {unique: true}}
  , contatos: [contato]
  });

  return db.model('usuarios', usuario);
};
