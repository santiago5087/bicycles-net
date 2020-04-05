var Bicycle = require('../models/bicycle');

exports.bicyclesList = (req, res) => {
    Bicycle.allBikes((err, bikes) => {
        res.render('bicycles/index', {bikes: bikes});
    });
}

exports.bicyclesRead = (req, res) => {
    Bicycle.allBikes((err, bikes) => {
        res.render('bicycles/read', {bikes: bikes});
    });
}

exports.bicyclesCreateGet = (req, res) => {
    res.render('bicycles/create')
}

exports.bicyclesCreatePost = (req, res) => {
    var code = req.body.code;
    var model = req.body.model;
    var color = req.body.color;
    var ubication = [req.body.latitude, req.body.longitude];
    var bike = new Bicycle({code: code, model: model, color: color, ubication: ubication});
    Bicycle.add(bike, (err, bike) => {
        console.log(bike);
        res.redirect('/bicycles');
    });
}

exports.bicyclesUpdateGet = (req, res) => {
    Bicycle.findById(req.params.id).then(bike => {
        res.render('bicycles/update', {bike})
    });
}

exports.bicyclesUpdatePost = (req, res) => {
    Bicycle.findByIdAndUpdate(req.params.id, req.body)
    .then(res.redirect('/bicycles'));
}

exports.bicyclesDelete = (req, res) => {
    var id = req.params.id;
    Bicycle.findByIdAndDelete(id).then(res.redirect('/bicycles'));
}