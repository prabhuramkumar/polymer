var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/user');

var request = require('request');

var githubClient = {
    id: '1cec815a7d243a2eb6fc',
    secret: '158c9327727cece85514bf01712d3251a59a1600'
};

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);

app.get('/github_callback', function (req, res) {
    var code = req.param('code');
    // console.log('got code ', code);
    request.post({
        url: 'https://github.com/login/oauth/access_token',
        form: {
            client_id: githubClient.id,
            client_secret: githubClient.secret,
            code: code
        },
        headers: {
            Accept: 'application/json'
        }
    }, function (err, httpResponse, body) {
        // console.log('error', err);
        // console.log('httpR', JSON.stringify(httpResponse));
        console.log('body', JSON.stringify(body));
        res.redirect('/index.html?access_token='+JSON.parse(body).access_token+'#blogs');
    });
});

app.post('/gist', function (req, res) {
    // console.log('create - got req to create gist');
    // console.log(req.param('gist'));
    request.post({
        url: 'https://api.github.com/gists?access_token=' + req.param('access_token'),
        // body: {
        //   "description": req.param('description'),
        //   "public": true,
        //   "files": {
        //     "file1.txt": {
        //       "content": req.param('content')
        //     }
        //   }
        // },
        body: req.param('gist'),
        // json: true,
        headers: {
            Accept: 'application/json',
            'user-agent': 'node.js'
            // Authorization: req.param('access_token') + ' OAUTH-TOKEN'
        }
    }, function (err, httpResponse, body) {
        // console.log('error', err);
        // console.log('httpR', httpResponse);
        // console.log('body', body);
        if(!err){
            res.status(200);
            res.send(body);
            // res.send({create: true});
        }else{
            res.status(500);
            res.send(body)
        }
    }); 
});

app.post('/gist/:id', function (req, res) {
    // console.log('edit-got req to edit gist', req.param('id'));
    // console.log(req.param('gist'));
    // console.log('https://api.github.com/gists/ ' + req.param('id') + ' ?access_token=' + req.param('access_token'));
    request({
        method: 'POST',
        url: 'https://api.github.com/gists/' + req.param('id') + '?access_token=' + req.param('access_token'),
        // body: {
        //   "description": req.param('description'),
        //   "public": true,
        //   "files": {
        //     "file1.txt": {
        //       "content": req.param('content')
        //     }
        //   }
        // },
        body: req.param('gist'),
        // json: true,
        headers: {
            Accept: 'application/json',
            'user-agent': 'node.js'
            // Authorization: req.param('access_token') + ' OAUTH-TOKEN'
        }
    }, function (err, httpResponse, body) {
        console.log('error', err);
        if(!err){
            res.status(200);
            res.send(body);
            // res.send({create: true});
        }else{
            res.status(500);
            res.send(body)
        }
    }); 
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
