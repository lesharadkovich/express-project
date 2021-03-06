
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressMongoDb = require('express-mongo-db');

var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('./webpack.config.js');
var config = require('./config');

var index = require('./routes/index');
var test = require('./routes/test');

var app = express();

app.use(expressMongoDb(config.uri));

app.use('/', index);
app.use('/test', test);

if (config.expressMiddleWare) {
	app.use(webpackMiddleware(webpack(webpackConfig), {
		publicPath: '/dist'
	}));
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('error');
});



var http = require('http');
var port = process.env.PORT || 3000;

var server = http.createServer(app);
server.listen(port, function () {
	console.log('Express server listening on port ' + port);
});

module.exports = app;