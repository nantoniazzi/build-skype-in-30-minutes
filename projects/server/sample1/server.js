var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var firstUserDesc = null;
var secondUserDesc = null;

app.post('/register', function(req, res) {
    console.log('register');
    let ret = {};
    if(firstUserDesc === null) {
        console.log('first user');
        ret = {'role': 'makeOffer'};
    } else if(secondUserDesc === null) {
        console.log('second user');
        ret = {'role': 'pollOffer'};
    } else {
        res = {'error': 'No more than 2 users allowed'};
    }
    res.json(ret);
});

app.post('/offer', function(req, res) {
    console.log('offer', req.body);
    firstUserDesc = req.body.desc;
    res.sendStatus(200);
});

app.post('/answer', function(req, res) {
    console.log('answer', req.body.desc);
    secondUserDesc = req.body.desc;
    res.sendStatus(200);
});

app.get('/getOffer', function(req, res) {
    console.log('getOffer');
    res.send({'desc': firstUserDesc});
});

app.get('/getAnswer', function(req, res) {
    console.log('getAnswer');
    res.send({'desc': secondUserDesc});
});

app.post('/candidate', function(req, res) {
    console.log('candidate', req.body.candidate);
});

app.listen(3000);
