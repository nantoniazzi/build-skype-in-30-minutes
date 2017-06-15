var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));

var firstUser = null;
var secondUser = null;

app.post('/register', function(req, res) {
    let ret = {};
    if(firstUser === null) {
        ret = {'role': 'makeOffer'};
    } else if(secondUser === null) {
        ret = {'role': 'pollOffer'};
    } else {
        res = {'error': 'No more than 2 users allowed'};
    }
    res.send(ret);
});

app.post('/offer', function(req, res) {
    firstUser.desc = req.body.desc;
    res.sendStatus(200);
});

app.post('/answer', function(req, res) {
    secondUser.desc = req.body.desc;
    res.sendStatus(200);
});

app.get('/getOffer', function(req, res) {
    res.send(firstUser.desc);
});

app.get('/getAnswer', function(req, res) {
    res.send(secondUser.desc);
});

app.listen(3000);
