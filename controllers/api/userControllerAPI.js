var User = require('../../models/user');

exports.user_list = (req, res) => {
    User.find({}, (err, result) => {
        res.status(200).json({
            users: result
        })
    })
}

exports.user_create = (req, res) => {
    var usuario = new User({name: req.body.name, email: req.body.email, password: req.body.password});

    usuario.save((err, doc) => {
        if (err) return res.status(500).json(err);
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