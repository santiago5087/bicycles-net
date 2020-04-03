var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var reserveSchema = new Schema({
    since: Date,
    until: Date,
    bicycle: {type: mongoose.Schema.Types.ObjectId, ref: 'Bycicles'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

reserveSchema.methods.reserveDays = function() {
    return moment(this.until).diff(this.since, 'days') + 1;
}

module.exports = mongoose.model('Reserve', reserveSchema);
