var express = require('express');
var app = express();
var path = require('path');

// app.use('/dist', express.static(path.resolve(__dirname, '..', 'dist')));
app.use('/dist', express.static(path.resolve(__dirname)));

app.get('/index.html', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'))
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});