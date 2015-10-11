//SERVER.JS

var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;  //if running on Haroku

app.get('/', function (req, res) {
  res.send('Todo API Root');
})

app.listen(PORT, function(){
  console.log('Express listening on port ' + PORT + '!');

  
})
