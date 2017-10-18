var Hapi = require('hapi');
var mysql= require('mysql');

var connection = mysql.createConnection({
    host:"hapi-mysql.c4mmfcl96i0z.us-east-2.rds.amazonaws.com",
    user:"admin",
    password:"admin123",
    port:"3306",
    database:"test_db"
});

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 8080 });
connection.connect();

server.register(require('inert'));
server.register(require('vision'),function(err){

    if(err){
      throw err;
    }

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
       connection.query('SELECT quote,credit from quotes order by rand() limit 1', function(err, rows, fields) {
       if (err) throw err;
       reply.view('index',{quote:rows[0].quote,credit:rows[0].credit});
       });
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});


server.views({
     engines: {
         html: require('handlebars')
     },
     relativeTo: __dirname,
     path: 'templates'
 });


});

server.start( function(){
     console.log('Catch the action at : '+server.info.uri);
});
