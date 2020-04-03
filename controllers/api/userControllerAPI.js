var User = require('../../models/user');

exports.user_list = (req, res) => {
    User.find({}, (err, res) => {
        res.status(200).json({
            bikes: res
        })
    })
}

exports.user_create = (req, res) => {
    var usuario = new User({name: req.body.name});

    usuario.save((err, doc) => {
        res.status(200).json({
            user: doc
        })
    });
}

exports.user_reserve = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        user.reserve(req.body.bikeId, req.body.since, req.body.until, (err, rs) => {
            if (err) console.log(err);
            res.status(200).json({
                reserve: rs 
            })
        })
    })
}