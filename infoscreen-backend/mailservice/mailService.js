const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'send.one.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendEmail = async (to, subject, html) => {
    // If the mail service is disabled, do nothing
    if (process.env.MAIL_SERVICE_ENABLED !== 'true') {
        console.log('Mail service is disabled.');
        return;
    }

    const mailOptions = {
        from: 'kaizen@oniu.no', // sender address
        to, // recipient address
        subject, // Subject line
        html // HTML body content
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};