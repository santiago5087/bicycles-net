require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('./config/passport');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var jwt = require('jsonwebtoken');

var User = require('./models/user');
var Token = require('./models/token');

var indexRouter = require('./routes/index');
var bicyclesRouter = require('./routes/bicycles');
var bicyclesAPIRouter = require('./routes/api/bicycles');
var authAPIRouter = require('./routes/api/auth');

var usersRouter = require('./routes/users');
var usersAPIRouter = require('./routes/api/users');
var tokenRouter = require('./routes/token');

var store;
if (process.env.NODE_ENV == 'development') {
  store = new session.MemoryStore;
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  
  // store.on('error', (err) => {
  //   assert.ifError(error);
  //   assert.ok(false);
  // });
}

var app = express();

app.set('secretKey', 'miClaveSuperSecreta112233');
app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000}, //Tiempo de duración de la cookie (milisec.)
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: '***Bicycles network in Medellín !!!***'
}));
//secret: Es la semilla de la generación del código de ecriptación del id de la cookie que viaja entre el servidor y el cliente

var mongoDB = process.env.MONGO_URI;
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
app.use('/bicycles', loggedIn, bicyclesRouter);
app.use('/token', tokenRouter);

app.use('/api/auth', authAPIRouter);
app.use('/api/bicycles', validateUser, bicyclesAPIRouter);
app.use('/api/users', usersAPIRouter);

//Permisos de la API
app.get('/auth/google', 
  passport.authenticate('google', {scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read']}
    ));

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/error'
}));

app.get('/login', (req, res, next) => {
  res.render('session/login');
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.render('session/login', {info});
    req.logIn(user, (err) => {
      return res.redirect('/');
    });
  })(req, res, next); //Primero definimos el authenticate y luego lo ejecutamos pasándole esto sparámetros
});

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

app.get('/forgotPassword', (req, res) => {
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) return res.render('session/forgotPassword', {info: {message: 'This email doesn\'t exist for an existing user'}});

    user.resetPassword((err) => {
      if (err) return next(err);
      res.render('session/forgotPasswordMessage');
    });
  });
});

app.get('/resetPassword/:token', (req, res, next) => {
  Token.findOne({token: req.params.token}, (err, token) => {
    if (!token) return res.status(400).send({type: 'not-verified', msg: "There's no user with the associated token. Verify your token doesn't have expire."});

    User.findById(token._userId, (err, user) => {
      if (!user) return res.status(400).send({msg: "There's no user with the associated token."});
      res.render('session/resetPassword', {errors: {}, user: user});
    });
  });
});

app.post('/resetPassword', (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: {message: "Doesn't match with the password entered"}}, user: new User({email: req.body.email})});
    return;
  }

  User.findOne({email: req.body.email}, (err, user) => {
    user.password = req.body.password;
    user.save((err) => {
      if (err) res.render('session/resetPassword', {errors: err.errors, user: new User({email: req.body.email})});
      else res.redirect('/login');
    });
  });
});

// app.use('/privacyPolicy', (req, res) => {
//   res.sendFile('public/privacyPolicy.html');
// })

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

function loggedIn(req, res, next) { //Para la parte web, para API se hace de otra forma
  if (req.user) next();
  else {
    console.log('User without sign in');
    res.redirect('/login');
  }
}

//secretKey: clave con la cual se cifra el token
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-acces-token'], req.app.get('secretKey'), (err, decoded) => {
    if (err) res.json({status: "error", message: err.message, data: null});
    else {
      req.body.userId = decoded.id;
      console.log('jwt verify: ' + decoded);
      next();
    }
  });
}

module.exports = app;