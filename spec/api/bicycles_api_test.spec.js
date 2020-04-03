var mongoose = require('mongoose');
var Bicycle = require("../../models/bicycle");
const request = require('request');
var server = require('../../bin/www');

var urlBase = 'http://localhost:3000/api/bicycles';

beforeAll((done) => {
    var mongoDB = "mongodb://localhost/testdb";
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    mongoose.set('useCreateIndex', true);

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

describe("Bicycles API", () => {
    describe("GET BICYCLES /", () => {
        it("Status 200", (done) => {
            expect(Bicycle.allBikes(function(err, bikes) {
                expect(bikes.length).toBe(0);
            }))

            var a = new Bicycle({code: 1, model: 'Urban', color: 'Golden', ubication: [6.2568693,-75.5923187]});
            Bicycle.add(a);

            request.get(urlBase, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                done();
            })
        });
    });

    describe('POST BICYCLES /create', () => {
        it("Status 200", (done) => {
            var headers = {'content-type': 'application/json'};
            var bike = '{"code": 10, "color": "Yellow", "model": "Off-road", "latitude": 6.2568693, "longitude": -75.5923187}';
            request.post({
                headers: headers,
                url: urlBase + '/create',
                body: bike
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                Bicycle.findOne({code: 10}, (err, res) => {
                    expect(res.color).toBe("Yellow");
                    done();
                })
            })
        })
    })

    describe('PUT /:code', () => {
        it("Status 200 and update a bike with ID 15", (done) => {
            var a = new Bicycle({code: 15, model: 'Urban', color: 'Golden', ubication: [6.2568693,-75.5923187]});
            Bicycle.add(a, (err, result) => {
                var body = '{"color": "Gray", "model": "Street"}';
                request.put({
                    headers: {'content-type': 'application/json'},
                    url: urlBase + '/15',
                    body: body}, 
                    (error, response, body) => {
                        Bicycle.findOne({code: 15}, (err, res) => {
                            expect(response.statusCode).toBe(200);
                            expect(res.color).toBe("Gray");
                            expect(res.model).toBe("Street");
                            done();
                        });
                })
            })
        })
    })

    describe('DELETE /:code', () => {
        it("Status 200 and delete a bike with ID 15", (done) => {
            Bicycle.allBikes(function(err, bikes) {
                expect(bikes.length).toBe(0);
    
                var a = new Bicycle({code: 22, model: 'Urban', color: 'Golden', ubication: [6.2568693,-75.5923187]});
                Bicycle.add(a, (err, result) => {
                    Bicycle.allBikes((err, bikes2) => {
                        expect(bikes2.length).toBe(1);
                        request.delete(urlBase + '/22', (error, response, body) => {
                            expect(response.statusCode).toBe(200);
                            Bicycle.allBikes((err, bikes3) => {
                                expect(bikes3.length).toBe(0);
                                done();
                            })
                        })
                    })
                });
            })
        })
    })
});