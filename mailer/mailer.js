var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport'); //plugin de nodemailer

let mailConfig;
if (process.env.NODE_ENV == 'production') {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }
    mailConfig = sgTransport(options);

} else {
    if (process.env.NODE_ENV == 'staging') {
        console.log('XXXXXXXXXXXXXXX');
        const options = {
            api_key: process.env.SENDGRID_API_SECRET
        }
    } else {
        //All emails are catched by ethereal.email
        //Development environment
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ethereal_email, //Obliga a los desarrolladores a crear su propio ethereal
                pass: process.env.ethereal_pwd
            }
        }
    }
}

module.exports = nodemailer.createTransport(mailConfig);