var User = require('../models/user');
var Token = require('../models/token');

module.exports = {
    confirmationGet: function(req, res) {
        var paramToken = req.params.token.toString();
        
        Token.findOne({token: paramToken}, (err, token) => {
            if (!token) return res.status(400).send({type: 'not-verified', msg: 'User not found with this token, it might has been expired, you must to request one'});
            
            User.findById(token._userId, function(err, user) {
                if (!user) return res.status(400).send({msg: 'Don\'t we found an user whit this token'})
                if (user.verificated) return res.redirect('/users');
                user.verificated = true;

                user.save(function(err) {
                    console.log("save final")
                    if (err) return res.status(400).send({msg: err.message});
                    res.redirect('/');
                });
            });
        });
    }
}