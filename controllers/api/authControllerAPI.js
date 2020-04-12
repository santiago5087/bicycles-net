const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function(req, res, next) { 
        User.findOne({email: req.body.email}, (err, userInfo) => {
            if (err) next(err);
            else {
                if (userInfo == null) return res.status(401).json({status: "error", message: "Invalid email\/password", data: null});
                if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '7d'});
                    res.status(200).json({message: "User found !", data: {user: userInfo, token: token}});
                } else {
                    res.status(401).json({status: "error", message: "Invalid email\/password", data: null});
                }
            }
        })
    },
    forgotPassword: function(req, res, next) {
        User.findOne({email: req.body.email}, (err, user) => {
            if (!user) return res.status(401).json({message: "User doesn't exist", data: null});
            user.resetPassword((err) => {
                if (err) return next(err);
                res.status(200).json({message: "An email was sent to re-establish password", data: null});
            });
        });
    },
    authFacebookToken: function(req, res, next) {
        if (req.user) {
            req.user.save().then(() => {
                const token = jwt.sign({id: req.user.id}, req.app.get('secretKey'), {expiresIn: '7d'});
                res.status(200).json({message: "User found or created!", data: {user: req.user, token: token}});
            });
        } else {
            res.status(401);
        }
    }
}