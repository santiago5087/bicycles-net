var Bicycle = require('../models/bicycle');

exports.bicyclesList = (req, res) => {
    res.render('bicycles/index', {bikes: Bicycle.allBikes});
}

exports.bicyclesCreateGet = (req, res) => {
    res.render('bicycles/create')
}

exports.bicyclesCreatePost = (req, res) => {
    var id = req.body.id;
    var model = req.body.model;
    var color = req.body.color;
    var ubication = [req.body.latitude, req.body.longitude];
    var bike = new Bicycle(id, model, color, ubication);
    Bicycle.add(bike);
    res.redirect('/bicycles');
}

exports.bicyclesUpdateGet = (req, res) => {
    var bike = Bicycle.findById(req.params.id);
    res.render('bicycles/update', {bike})
}

exports.bicyclesUpdatePost = (req, res) => {
    var bike = Bicycle.findById(req.params.id);
    bike.id = req.body.id;
    bike.color = req.body.color;
    bike.model = req.body.model;
    bike.ubication = [req.body.latitude, req.body.longitude];
    res.redirect('/bicycles');
}

exports.bicyclesDelete = (req, res) => {
    var id = req.params.id;
    Bicycle.removeById(id);
    res.redirect('/bicycles');
}