var mongoose = require('mongoose');
var Reserve = require('./reserve');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String
});

usuarioSchema.methods.reserve = function(bikeId, since, until, cb) {
    var reserve = new Reserve({user: this._id, bicycle: bikeId, since: since, until: until})
    console.log(reserve);
    reserve.save(cb);
}

module.exports = mongoose.model('User', userSchema);