var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('./config/passport');
var session = require('express-session');

var indexRouter = require('./routes/index');
var bicyclesRouter = require('./routes/bicycles');
var bicyclesAPIRouter = require('./routes/api/bicycles');
var usersRouter = require('./routes/users');
var usersAPIRouter = require('./routes/api/users');
var tokenRouter = require('./routes/token');

var app = express();

const store = new session.MemoryStore;
app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000}, //Tiempo de duración de la cookie (milisec.)
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: '***Bicycles network in Medellín !!!***'
}));
//secret: Es la semilla de la generación del código de ecriptación del id de la cookie que viaja entre el servidor y el cliente


var mongoDB = "mongodb://localhost/netBicyclesDB"; //Si no existe la DB la crea
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session()); //Para cuando se usa sesiones persistentes
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bicycles', bicyclesRouter);
app.use('/token', tokenRouter);
app.use('/api/bicycles', bicyclesAPIRouter);
app.use('/api/users', usersAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;