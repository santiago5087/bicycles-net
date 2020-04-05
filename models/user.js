var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Reserve = require('./reserve');
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var saltRounds = 10; //Da cierta aleatoriedad a la encriptación

const validateEmail = (email) => {
    var rge = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (rge.test(email)) {
        return
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
    verficated: {
        type: Boolean,
        default: false
    }
});

//Antes de que ocurra el evento save, luego con next hace que continúe con lo que vaya a hacer
userSchema.pre('save', (next) => {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds).then(hash => {
            this.password = hash;
        })
        next();
    }    
});

userSchema.plugin(uniqueValidator, {message: "{PAHT} already exists"});

userSchema.methods.validPassword = (pass) => {
    return bcrypt.compareSync(pass, this.password);
}

userSchema.methods.reserve = function(bikeId, since, until, cb) {
    var reserve = new Reserve({user: this._id, bicycle: bikeId, since: since, until: until})
    console.log(reserve);
    reserve.save(cb);
}

module.exports = mongoose.model('User', userSchema);