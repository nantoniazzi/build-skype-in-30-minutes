var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));

var user1 = null;
var user2 = null;

// Get the list of connected user and their associated data (name and SDP)
app.post('/users', function(req, res) {
    res.send('hello');
});

// New connection to the server
app.post('/join', function(req, res) {

});

app.post('/answer', function(req, res) {

});

app.listen(3000);
