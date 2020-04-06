var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Token = require('./token');
var Reserve = require('./reserve');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var uniqueValidator = require('mongoose-unique-validator');
var mailer = require('../mailer/mailer');
var saltRounds = 10; //Da cierta aleatoriedad a la encriptación

const validateEmail = (email) => {
    var rge = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (rge.test(email)) {
        return true
    } else return false
}

var userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true, //No funciona sin el plugin
        trim: true,
        required: true,
        lowercase: true,
        validate: validateEmail, //mongoose
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //mongodb
    },
    password: {
        type: String,
        required: true
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificated: {
        type: Boolean,
        default: false
    }
});

//Antes de que ocurra el evento save, luego con next hace que continúe con lo que vaya a hacer
userSchema.pre('save', function(next) { //Si se utiliza un arrow function no funciona (modifica el contexto de this)
    if (this.isModified('password')) {
        this.password = bcrypt.hash(this.password, saltRounds).then(hash => {
            this.password = hash;
            next();
        })
    } else next();  
});

userSchema.plugin(uniqueValidator, {message: "Error, {PATH} already exists"});

userSchema.methods.validPassword = function(pass) {
    return bcrypt.compareSync(pass, this.password);
}

userSchema.methods.reserve = function(bikeId, since, until, cb) {
    var reserve = new Reserve({user: this._id, bicycle: bikeId, since: since, until: until})
    console.log(reserve);
    reserve.save(cb);
}

userSchema.methods.sendWelcomeEmail = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    //token encriptado para que alguien no pueda confirmar cuentas con hackeos
    const emailDestination = this.email;
    token.save(function (err) {
        if (err) return console.log(err.message)
        
        const mailOptions = {
            from: 'no-reply@bicylesnet.com',
            to: emailDestination,
            subject: "Account verification",
            text: 'Hi!, \n\n' + 'Please, to verficate your account click on this link: ' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + ' \n'
        }

        mailer.sendMail(mailOptions, function(err) {
            if (err) return console.log(err.message);
            console.log('A verificatin email has been sent to: ' + emailDestination + '.');
        })
    })
}

module.exports = mongoose.model('User', userSchema);