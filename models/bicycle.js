var Bicycle = function(id, model, color, ubication) {
    this.id = id;
    this.model = model;
    this.color = color;
    this.ubication = ubication;
}

Bicycle.prototype.toString = function() {
    return `id: ${this.id} + | color: ${this.color}`
}

Bicycle.allBikes = []

Bicycle.add = function(aBike) {
    Bicycle.allBikes.push(aBike)
}

Bicycle.findById = function(idBike) {
    var bike = Bicycle.allBikes.find(x => x.id == idBike);
    if (bike) {
        return bike
    } else {
        throw new Error(`There is no bicycles with the entered ID: ${idBike}`)
    }
}

Bicycle.removeById = function(idBike) {
    var lengthOrg = Bicycle.allBikes.length
    Bicycle.allBikes = Bicycle.allBikes.filter(x => x.id != idBike)
    if (lengthOrg == Bicycle.allBikes.length) {
        throw new Error(`There is no bicycles with the entered ID: ${idBike}`)
    }
}

var a = new Bicycle(1, 'Urban', 'red', [6.2568693,-75.5923187]);
var b = new Bicycle(2, 'Urban', 'white', [6.2616365,-75.5931341]);

Bicycle.add(a);
Bicycle.add(b);

module.exports = Bicycle;