var User = require('./../models/user');

exports.userList = (req, res) => {
    User.find({}).then(users => {
        res.render('users/index', {users: users});
    }).catch(err => console.log(err));
}

exports.userCreateGet = (req, res) => {
        res.render('users/create', {errors: {}, user: new User()});
}

exports.userCreatePost = (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    
    if (password != confirm_password) {
        res.render('users/create', {errors: {confirm_password: {message: "Passwords don't match"}}, user: new User({name: name, email: email})});
    } else {
            User.create({name: name, email: email, password: password}).then(userU => {
                userU.sendWelcomeEmail();
                res.redirect('/users')
            }).catch(err => {
                console.log(err);
                res.render('users/create', {errors: {error: err.errors}, user: new User()});
            });
    }
} 

exports.userDelete = (req, res) => {
    var id = req.params.id;
    User.findByIdAndDelete(id).then(res.redirect('/users')); //Test
}