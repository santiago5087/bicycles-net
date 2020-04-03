var mongoose = require('mongoose');
var Bicycle = require("../../models/bicycle");

beforeAll((done) => {
    var mongoDB = "mongodb://localhost/testDB";
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, "connection error"));
    db.once('open', () => {
        console.log("We are connected to test database");
        done();
    });
});

afterEach((done) => {
    Bicycle.deleteMany({}, (err, success) => {
        if (err) console.log(err);
        done();
    });
});

describe('Testing Bicycles', () => {

    describe('Bicycle.createInstance', () => {
        it('Creating an Bicycle instance', () => {
            var bike = Bicycle.createInstance(1, 'Purple', 'Street', [-33.2, 5.39]);

            expect(bike.code).toBe(1);
            expect(bike.color).toBe('Purple');
            expect(bike.model).toBe('Street');
            expect(bike.ubication[0]).toEqual(-33.2);
            expect(bike.ubication[1]).toEqual(5.39);
        });
    });

    describe('Bicycle.allBikes', () => {
        it('Starts empty', (done) => {
            Bicycle.allBikes((err, bikes) => {
                expect(bikes.length).toBe(0);
                done();
            })
        })
    })

    describe('Bicycle.add', () => {
        it('Add just one bicycle', (done) => {
            var bike = new Bicycle({code: 1, color: 'Purple', model: 'Street', ubication: [-33.2, 5.39]});
            Bicycle.add(bike, (err, newBike) => {
                if (err) console.log(err);
                Bicycle.allBikes((err, bikes) => {
                    expect(bikes.length).toEqual(1);
                    expect(bikes[0].code).toEqual(bike.code);
                    done();
                })
            })
        })
    });

    describe('Bicycle.findByCode', () => {
        it('Must to returne one bicycle with code: 1', (done) => {
            var bike = new Bicycle({code: 1, color: 'Purple', model: 'Street', ubication: [-33.2, 5.39]});
            Bicycle.add(bike, (err, newBike) => {
                if (err) console.log(err);
                var bike2 = new Bicycle({code: 2, color: 'Green', model: 'Off-road', ubication: [-23.2, 75.39]});
                Bicycle.add(bike2, (err, newBike2) => {
                    Bicycle.findByCode(1, (err, targetBike) => {
                        expect(targetBike.code).toBe(bike.code);
                        expect(targetBike.color).toBe(bike.color);
                        expect(targetBike.model).toBe(bike.model);
                        done();
                    })
                })
            })
        })
    });

    describe('Bicycle.removeByCode', () => {
        it('Must to delete one bicycle with code: 1', (done) => {
            Bicycle.allBikes(function(err, bikes) {
                expect(bikes.length).toBe(0);
                //console.log(`Tamaño de: ${bikes} es = ${bikes.length}`)
            })
            var bike = new Bicycle({code: 1, color: 'Purple', model: 'Street', ubication: [-33.2, 5.39]});
            Bicycle.add(bike, (err, newBike) => {
                Bicycle.allBikes(function(err, bikes2) {
                    expect(bikes2.length).toBe(1);

                    Bicycle.removeByCode(1, function(err, rmBike) {
                        expect(Bicycle.allBikes(function(err, bikes3) {
                            expect(bikes3.length).toBe(0);
                            done();
                        }))
                    })
                })
            })
        })
    })
});

/*
beforeEach(() => {
    Bicycle.allBikes = [];
});

describe("Bicycle.allBikes", () => {
    it("Starts empty", () => {
        expect(Bicycle.allBikes.length).toBe(0);
    })
});

describe("Bicycle.add", () => {
    it("Adding one", () => {
        expect(Bicycle.allBikes.length).toBe(0);

        var a = new Bicycle(1, 'Urban', 'red', [6.2568693,-75.5923187]);
        Bicycle.add(a);
        
        expect(Bicycle.allBikes.length).toBe(1);
        expect(Bicycle.allBikes[0]).toBe(a);
    })
});

describe("Bicycle.findById", () => {
    it("Must to return a bike with ID 1", () => {
        expect(Bicycle.allBikes.length).toBe(0);

        var a = new Bicycle(1, 'Urban', 'green', [6.2568693,-75.5923187]);
        var b = new Bicycle(2, 'Urban', 'white', [6.2616365,-75.5931341]);
        Bicycle.add(a);
        Bicycle.add(b);
        var targetBike = Bicycle.findById(1)

        expect(targetBike.id).toBe(1);
        expect(targetBike.color).toBe(a.color);
        expect(targetBike.model).toBe(a.model);
    })
});

describe("Bicycle.removeById", () => {
    it("Must to remove a bike wit ID 1", () => {
        expect(Bicycle.allBikes.length).toBe(0);

        var a = new Bicycle(1, 'Urban', 'green', [6.2568693,-75.5923187]);
        Bicycle.add(a);

        expect(Bicycle.allBikes.length).toBe(1);
        Bicycle.removeById(1);
        expect(Bicycle.allBikes.length).toBe(0);
    })
});
*/