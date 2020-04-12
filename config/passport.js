const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');   
const User = require('../models/user');

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({email: username}, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message: 'Email doesn\'t exist or incorrect'}); }
            if (!user.validPassword(password)) {return done(null, false, {message: 'Incorrect password'}); }

            return done(null, user)
        });
    }
));

//Hacer la autenticación por token de Google y la autenticación web de Facebook
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
},
    function(accessToken, refreshToken, profile, cb) { //profile: datos de la cuenta de google
        console.log(profile);

        User.findOneOrCreateByGoogle(profile, function(err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET
  }, function(accessToken, refreshToken, profile, done) {
      try {
          User.findOneOrCreateByFacebook(profile, function (error, user) {
              if (error) console.log('error' + error);
              else return done(error, user);
          });

        } catch(err2) {
            console.log(err2);
            return done(err2, null);
        }
      }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;