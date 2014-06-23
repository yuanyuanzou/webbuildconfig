var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var home = require('./routes/home');
var login = require('./routes/login');
var logout = require('./routes/logout');
var regist = require('./routes/regist');
var show_detail = require('./routes/show_detail');
var build_result = require('./routes/build_result');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/imgcust'); //连接到一个test的数据库

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('html', require('swig').renderFile);
/*app.engine('html', require('ejs').renderFile);*/
/*app.engine('html', consolidate.swig);*/
/* Tell swig where to look for templates when one extends another. */
/*swig.init({root: __dirname + '/views', cache:true});*/

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/regist', regist);
app.use('/login', login);
app.use('/logout', logout);
app.use('/build_result', build_result);

app.get('/show_detail', show_detail.getdata);

app.use('/files', express.static(path.join(__dirname, 'files')));

//session id
app.use(cookieParser('Wilson'));
app.use(session({
    secret: 'wilson'
}));

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
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;