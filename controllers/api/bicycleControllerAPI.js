var Bicycle = require('../../models/bicycle');

exports.bicycle_list = (req, res) => {
    res.json({
        bicycles: Bicycle.allBikes
    })
}

exports.bicycle_create = (req, res) => {
    var bike = new Bicycle(req.body.id, req.body.model, req.body.color); //Si faltan atributos se les pone null
    bike.ubication = [req.body.latitude, req.body.longitude];
    Bicycle.add(bike);

    res.status(200).json({
        bicycle: bike 
    })
}

exports.bicycle_update = (req, res) => {
    var bike = Bicycle.findById(req.params.id);
    if (req.body.hasOwnProperty("id")) {
        bike.id = req.body.id;
    }
    if (req.body.hasOwnProperty("model")) {
        bike.model = req.body.model;
    }
    if (req.body.hasOwnProperty("color")) {
        bike.color = req.body.color;
    }
    if (req.body.hasOwnProperty("latitude")) {
        bike.latitude = req.body.latitude;
    }
    if (req.body.hasOwnProperty("longitude")) {
        bike.longitude = req.body.longitude;
    }

    res.json({
        bicycle: bike
    })
}

exports.bicycle_delete = (req, res) => {
    var bike = Bicycle.findById(req.body.id);
    var i = Bicycle.allBikes.indexOf(bike);
    Bicycle.allBikes.splice(i, 1)
    res.status(200).json({
        bicycle: bike
    })
}