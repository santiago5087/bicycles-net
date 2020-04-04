var mongoose = require('mongoose');
var User = require('../../models/user');
var Bicycle = require('../../models/bicycle');
var Reserve = require('../../models/reserve');
var request = require('request');
var server = require('../../bin/www');

var urlBase = 'http://localhost:3000/api/users';

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
    Promise.all([User.deleteMany({}), Bicycle.deleteMany({}), Reserve.deleteMany({})]).then(result => {
        done();
    }).catch(err => console.log(err));
});

describe("Users API", () => {
    describe("GET USERS /", () => {
        it("Status 200", (done) => {
            User.find({}).then(users => {
                expect(users.length).toBe(0);

                request.get(urlBase, (error, response) => {
                    expect(response.statusCode).toBe(200)
                    done();
                })
            }).catch(err => console.log(err));
        });
    });

    describe("POST USERS /create", () => {
        it("Status 200", (done) => {
            User.find({}).then(users => {
                expect(users.length).toBe(0);

                var user = '{"name": "Pedro"}';
                request.post({
                    headers: {'content-type': 'application/json'},
                    url: urlBase + '/create',
                    body: user
                }, (err, res, body) => {
                   User.find({}).then(users2 => {
                       expect(users2.length).toBe(1);
                       expect(res.statusCode).toBe(200);
                       expect(JSON.parse(res.body).user.name).toBe("Pedro");
                       done();
                   }) 
                })
            })
        });
    });

    describe("POST RESERVE /reserve", () => {
        it("Status 200", (done) => {
            Reserve.find({}).then(reserves => {
                expect(reserves.length).toBe(0);
                var user = new User({name: "Andrés"});
                var bike = new Bicycle({code: 22, model: 'Urban', color: 'Golden', ubication: [6.2568693,-75.5923187]});

                Promise.all([user.save(), bike.save()]).then(result => {
                    var userSaved = result[0];
                    var bikeSaved = result[1];

                    console.log(userSaved)
                    console.log(JSON.stringify(userSaved._id));
                    User.findById(userSaved._id).then(userf => {
                        console.log(userf)
                    })

                    var body = {
                        id: userSaved._id,
                        bikeId: bikeSaved._id,
                        since: "2019-12-14",
                        until: "2019-12-31" }

                        body = JSON.stringify(body);

                    request.post({
                        headers: {'content-type': 'application/json'},
                        url: urlBase + '/reserve',
                        body: body}, (err, res) => {
                            Reserve.find({}).then(reserves2 => {
                                expect(reserves2.length).toBe(1); 
                                expect(JSON.parse(res.body).reserve.user).toBe(String(userSaved._id));
                                expect(JSON.parse(res.body).reserve.bicycle).toBe(String(bikeSaved._id));
                                done();
                            })
                        })
                    })
                })
        });
    });
})
