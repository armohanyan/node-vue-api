const {
    google
} = require('googleapis');
const nodemailer = require('nodemailer');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
}); 

module.exports = class MailService {

    mailer = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            type: "OAuth2",
            user: "armen14.03.2003@gmail.com",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: oauth2Client.getAccessToken()
        }
    })

    sendMail(toEmail, url) {
        this.mailer.sendMail({
            from: '"Node-Vue" <armen14.03.2003@gmail.com>', // sender address
            to: toEmail,
            subject: "Verify Email",
            html: `<a href="${url}">Click to verify email</a>` // html body
        }).then(sent => {
            console.log(sent)
        }).catch(err => {
            throw err;
        })
    }
}