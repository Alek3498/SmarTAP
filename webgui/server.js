const express=require('express')
var https = require('https');
const { normalize } = require('path')
var hbs=require('express-handlebars')
var router=require('./routes/routes')
const app=express()
const fs=require('fs')
var path=require('path')
var bodyparser=require("body-parser")
require('dotenv').config()
var hbshelper=require('../webgui/public/js/hbshelper')


var port = normalizePort(process.env.PORT || '443');
app.set('port', port);
var server = https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'Daitek4All!'
  },app);

//middelware
app.use(bodyparser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.engine('hbs', hbs({extname: 'hbs',layoutsDir: __dirname +'/views/layouts/'}));
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  }


