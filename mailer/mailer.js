var nodemailer = require('nodemailer');

var mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'terrance.larson@ethereal.email',
        pass: 'dUBQ6j3enJNVxj5bxG'
    }
}

module.exports = nodemailer.createTransport(mailConfig);