var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 43200  //Cuando pase este tiempo, mongo elimina el documento de la DB
    }
});

module.exports = mongoose.model('Token', tokenSchema);