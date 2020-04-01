var Bicycle = require("../../models/bicycle");
const request = require('request');
var server = require('../../bin/www');

beforeEach(() => {
    Bicycle.allBikes = []
});

describe("Bicycles API", () => {
    describe("GET BICYCLES /", () => {
        it("Status 200", () => {
            expect(Bicycle.allBikes.length).toBe(0)

            var a = new Bicycle(1, 'Urban', 'Golden', [6.2568693,-75.5923187]);
            Bicycle.add(a);

            request.get('http://localhost:3000/api/bicycles', (error, response, body) => {
                expect(response.statusCode).toBe(200);
            })
        })
    });

    describe('POST BICYCLES /create', () => {
        it("Status 200", (done) => {
            var headers = {'content-type': 'application/json'};
            var bike = '{"id": 10, "color": "Yellow", "model": "Off-road", "latitude": 6.2568693, "longitude": -75.5923187}';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicycles/create',
                body: bike
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                expect(Bicycle.findById(10).color).toBe("Yellow");
                done();
            })
        })
    })

    describe('PUT /:id', () => {
        it("Status 200 and update a bike with ID 15", (done) => {
            expect(Bicycle.allBikes.length).toBe(0)

            var a = new Bicycle(15, 'Urban', 'Golden', [6.2568693,-75.5923187]);
            Bicycle.add(a);

            var body = '{"color": "Gray", "model": "Street"}';
            request.put({
                headers: {'content-type': 'application/json'},
                url: 'http://localhost:3000/api/bicycles/15',
                body: body}, 
                (error, response, body) => {
                    var targetBike = Bicycle.findById(15);
                    expect(response.statusCode).toBe(200);
                    expect(targetBike.color).toBe("Gray");
                    expect(targetBike.model).toBe("Street");
                    done();
            })
        })
    })

    describe('DELETE /:id', () => {
        it("Status 200 and delete a bike with ID 15", (done) => {
            expect(Bicycle.allBikes.length).toBe(0)

            var a = new Bicycle(15, 'Urban', 'Golden', [6.2568693,-75.5923187]);
            Bicycle.add(a);
            expect(Bicycle.allBikes.length).toBe(1);

            request.delete('http://localhost:3000/api/bicycles/15', (error, response, body) => {
                //expect(response.statusCode).toBe(200);
                expect(Bicycle.allBikes.length).toBe(0);
                done();
            })
        })
    })
});

//Pruebas para update y delete