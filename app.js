var express = require('express');
var app = express();
var path = require("path");

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.listen(1337);

console.log('Example app listening on port 1337!');
