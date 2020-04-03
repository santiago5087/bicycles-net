var Bicycle = require('../../models/bicycle');

//El controlador es el que hace las operaciones sobre la BD

exports.bicycle_list = (req, res) => {
    Bicycle.allBikes(function(err, bikes) {
        res.json({
            bicycles: bikes 
        });
    })
}

exports.bicycle_create = function(req, res) {
    var bike = new Bicycle({
        code: req.body.code,
        model: req.body.model,
        color: req.body.color,
        ubication: [req.body.latitude, req.body.longitude]
    })

    Bicycle.add(bike, (err, result) => {
        res.json({
            bike: result
        })
    })
}

exports.bicycle_update = function(req, res) {
    Bicycle.findOneAndUpdate({code: req.params.code}, req.body, {new: true},  (err, doc) => {
        res.json({
            bicycle: doc
        })
    })
}

exports.bicycle_delete = (req, res) => {
    Bicycle.deleteOne({code: req.params.code}, (err) => {
        res.status(200).json({
            message: "Deleted bicycle"
        })
    });
}