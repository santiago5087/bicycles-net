const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
},
    function(accessToken, refreshToken, profile, cb) { //profile: datos de la cuenta de google
        console.log(profile);

        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            console.log("Un nuevo usuario fue insertado!")
            return cb(err, user);
          });
        // User.findOneOrCreateByGoogle(profile, function(err, user) {
        //     return cb(err, user);
        // });
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